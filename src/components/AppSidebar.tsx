"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Shield,
  AlertTriangle,
  FileText,
  Settings,
  Radio,
  Users,
  TrendingUp,
  Crosshair,
  Brain,
  Activity,
  ChevronLeft,
  Command,
} from "lucide-react";
import { useShell } from "@/components/Shell";

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/" },
  { icon: Map, label: "GIS Tactical Map", href: "/gis-map" },
  { icon: Brain, label: "Predictive Analytics", href: "/predictive-analytics" },
  { icon: AlertTriangle, label: "Active Alerts", href: "/active-alerts" },
  { icon: Radio, label: "Unit Comms", href: "/unit-comms" },
  { icon: Shield, label: "Incidents", href: "/incidents" },
  { icon: Users, label: "Personnel", href: "/personnel" },
  { icon: TrendingUp, label: "Trend Analysis", href: "/trend-analysis" },
  { icon: FileText, label: "Reports & SitReps", href: "/reports" },
  { icon: Activity, label: "System Health", href: "/system-health" },
  { icon: Crosshair, label: "Target Zones", href: "/target-zones" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setSidebarOpen } = useShell();

  const handleNav = () => {
    setSidebarOpen(false);
  };

  return (
    <aside className="flex flex-col w-60 h-full bg-cpd-bg-secondary/80 backdrop-blur-xl border-r border-cpd-border-subtle">
      <div className="flex items-center justify-between p-3 border-b border-cpd-border-subtle">
        <Link href="/" onClick={handleNav} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cpd-accent/20 to-cpd-accent/5 flex items-center justify-center border border-cpd-accent/20 group-hover:border-cpd-accent/40 transition-colors">
            <Shield className="w-4.5 h-4.5 text-cpd-accent" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold text-cpd-accent tracking-widest">CPAS</h1>
            <p className="text-[9px] text-cpd-text-muted font-medium">v4.8 TACTICAL</p>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg text-cpd-text-dim hover:text-cpd-text hover:bg-cpd-bg-primary transition-colors lg:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 py-2 px-2 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNav}
              className={`group relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-cpd-accent/10 text-cpd-accent"
                  : "text-cpd-text-dim hover:bg-cpd-bg-primary/60 hover:text-cpd-text"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-cpd-accent rounded-r-full" />
              )}
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-cpd-accent" : "text-cpd-text-muted group-hover:text-cpd-text-dim"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-cpd-border-subtle">
        <div className="bg-cpd-bg-primary/60 rounded-lg p-2.5 border border-cpd-border-subtle">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cpd-success animate-pulse-glow" />
            <span className="text-[10px] text-cpd-success font-semibold tracking-wide">SYSTEM ONLINE</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] text-cpd-text-muted">AI Engine: <span className="text-cpd-text-dim">Operational</span></p>
            <p className="text-[9px] text-cpd-text-muted">Latency: <span className="text-cpd-success font-mono">12ms</span></p>
          </div>
          <div className="mt-2 pt-2 border-t border-cpd-border-subtle">
            <button
              onClick={() => {
                const e = new KeyboardEvent("keydown", { key: "k", metaKey: true });
                window.dispatchEvent(e);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md bg-cpd-bg-secondary/60 text-cpd-text-muted hover:text-cpd-text-dim text-[10px] transition-colors border border-cpd-border-subtle hover:border-cpd-border"
            >
              <Command className="w-3 h-3" />
              <span>Quick Search</span>
              <kbd className="ml-auto text-[9px] bg-cpd-bg-primary px-1 py-0.5 rounded border border-cpd-border font-mono">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
