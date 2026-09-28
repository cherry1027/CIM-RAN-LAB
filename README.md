# CIM–RAN Lab

**Digital Compute-in-Memory Benchmark for RAN Acceleration**

A small two-page React research prototype created for an Ericsson Master’s thesis application. It compares a conventional accelerator with a digital compute-in-memory architecture using configurable, synthetic RAN workloads.

## Live Demo

https://cim-ran-lab.charanvaranasi44.workers.dev

## Features

### Architecture Benchmark

- Select from three synthetic RAN workloads:
  - Massive-MIMO Matrix-Vector Multiply
  - Beamforming
  - Channel Estimation
- Configure antenna count, numerical precision, matrix size, and bandwidth.
- Compare conventional and digital CIM architecture diagrams.
- View synthetic estimates for:
  - Throughput
  - Latency
  - Energy per operation
  - Area
  - Memory utilisation
  - Output accuracy

### Design Space Explorer

- Configure antenna count, numerical precision, CIM array size, and memory utilisation.
- Results update instantly using deterministic formulas.
- Compare throughput, energy, area, and numerical accuracy.
- Review synthetic quantisation degradation for FP32, INT16, INT8, and INT4.
- Receive an architecture recommendation based on a calculated CIM Advantage Score.
- Low memory utilisation can switch the recommendation to a conventional accelerator.

## Technology

- React
- TypeScript
- Vinext
- Tailwind CSS
- Cloudflare Workers
- Wrangler
