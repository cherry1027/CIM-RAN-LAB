export type Precision = "INT4" | "INT8" | "INT16";
export type Workload =
  | "Massive-MIMO Matrix-Vector Multiply"
  | "Beamforming"
  | "Channel Estimation";

const precisionBits: Record<Precision, number> = { INT4: 4, INT8: 8, INT16: 16 };

const workloadProfile: Record<Workload, { compute: number; reuse: number; accuracy: number }> = {
  "Massive-MIMO Matrix-Vector Multiply": { compute: 1.35, reuse: 0.92, accuracy: 0 },
  Beamforming: { compute: 1.02, reuse: 0.78, accuracy: -0.15 },
  "Channel Estimation": { compute: 0.76, reuse: 0.62, accuracy: -0.35 },
};

const precisionAccuracy: Record<Precision, number> = { INT4: 94.2, INT8: 98.6, INT16: 99.5 };

export function architectureBenchmark({ workload, antennas, precision, matrix, bandwidth }: {
  workload: Workload; antennas: number; precision: Precision; matrix: number; bandwidth: number;
}) {
  const bits = precisionBits[precision];
  const profile = workloadProfile[workload];
  const antennaFactor = antennas / 64;
  const matrixFactor = Math.sqrt(matrix / 128);
  const bandwidthFactor = 0.72 + bandwidth / 145;
  const baseThroughput = 4.65 * profile.compute * antennaFactor * (8 / bits) * matrixFactor * bandwidthFactor;
  const reuseGain = 1.18 + profile.reuse * 0.72;
  const conventionalUtilisation = Math.min(82, 40 + profile.reuse * 27 + Math.log2(matrix / 64) * 3);
  const conventional = {
    throughput: baseThroughput,
    latency: 310 / (antennaFactor * matrixFactor * bandwidthFactor),
    energy: 36 * (bits / 8) * (1.08 - profile.reuse * 0.18),
    area: 8.2 * Math.pow(bits / 8, 0.32) * (0.94 + antennaFactor * 0.06),
    utilisation: conventionalUtilisation,
    accuracy: precisionAccuracy[precision] + profile.accuracy,
  };
  const cim = {
    throughput: baseThroughput * reuseGain,
    latency: conventional.latency / (reuseGain * 0.94),
    energy: conventional.energy * (0.78 - profile.reuse * 0.35),
    area: conventional.area * (1.13 - profile.reuse * 0.08),
    utilisation: Math.min(96, conventionalUtilisation + 13 + profile.reuse * 5),
    accuracy: conventional.accuracy - (bits === 4 ? 0.4 : 0.15),
  };
  return {
    conventional, cim,
    deltas: {
      throughput: ((cim.throughput / conventional.throughput) - 1) * 100,
      latency: ((cim.latency / conventional.latency) - 1) * 100,
      energy: ((cim.energy / conventional.energy) - 1) * 100,
      area: ((cim.area / conventional.area) - 1) * 100,
      utilisation: cim.utilisation - conventional.utilisation,
      accuracy: cim.accuracy - conventional.accuracy,
    },
  };
}

export function explorerBenchmark({ antennas, precision, arraySize, utilisation }: {
  antennas: number; precision: Precision; arraySize: number; utilisation: number;
}) {
  const bits = precisionBits[precision];
  const util = utilisation / 100;
  const antennaFactor = antennas / 64;
  const arrayFactor = arraySize / 128;
  const conventionalThroughput = 5.3 * antennaFactor * (8 / bits);
  const cimGain = 0.54 + util * 1.34 + Math.log2(antennas / 32) * 0.07 + arrayFactor * 0.1;
  const conventionalEnergy = 32 * (bits / 8) * (0.88 + antennaFactor * 0.12);
  const cimEnergyFactor = Math.max(0.32, 1.12 - util * 0.74 + Math.max(0, arrayFactor - 1) * 0.035);
  const conventionalArea = 8.1 * Math.pow(bits / 8, 0.32) * (0.95 + antennaFactor * 0.05);
  const conventionalAccuracy = precisionAccuracy[precision];
  const conventional = { throughput: conventionalThroughput, energy: conventionalEnergy, area: conventionalArea, accuracy: conventionalAccuracy };
  const cim = {
    throughput: conventionalThroughput * cimGain,
    energy: conventionalEnergy * cimEnergyFactor,
    area: 8.85 * Math.pow(bits / 8, 0.28) * (0.93 + arrayFactor * 0.07),
    accuracy: conventionalAccuracy - (bits === 4 ? 0.45 : 0.18) - Math.max(0, arrayFactor - 1) * 0.05,
  };
  const throughputImprovement = (cimGain - 1) * 100;
  const energyReduction = (1 - cimEnergyFactor) * 100;
  const areaOverhead = ((cim.area / conventional.area) - 1) * 100;
  const accuracyPenalty = conventional.accuracy - cim.accuracy;
  const score = Math.max(0, Math.min(100,
    50 + throughputImprovement * 0.25 + energyReduction * 0.28 - Math.max(0, areaOverhead) * 0.3 +
    (utilisation - 60) * 0.35 - accuracyPenalty * 3.5,
  ));
  return { conventional, cim, score, throughputImprovement, energyReduction, areaOverhead, accuracyPenalty, recommended: score >= 55 };
}

export const quantisationData = [
  { format: "FP32 Reference", accuracy: 99.9, delta: 0 },
  { format: "INT16", accuracy: 99.5, delta: -0.4 },
  { format: "INT8", accuracy: 98.6, delta: -1.3 },
  { format: "INT4", accuracy: 94.2, delta: -5.7 },
];
