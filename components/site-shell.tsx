import Link from "next/link";
import { Cpu, FlaskConical } from "lucide-react";

export function SiteShell({ active, children }: { active: "benchmark" | "explorer"; children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="CIM-RAN Lab home">
          <span className="brand-mark"><Cpu size={20} strokeWidth={1.6} /></span>
          <span><strong>CIM–RAN LAB</strong><small>Digital architecture research</small></span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link className={active === "benchmark" ? "active" : ""} href="/"><span>01</span> Benchmark</Link>
          <Link className={active === "explorer" ? "active" : ""} href="/explorer"><span>02</span> Design explorer</Link>
        </nav>
        <div className="prototype-label"><FlaskConical size={14} /> Research prototype</div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <span>Independent Research Prototype</span>
        <p>All RAN workloads, hardware parameters and benchmark results are synthetic. No Ericsson proprietary data is used.</p>
      </footer>
    </div>
  );
}
