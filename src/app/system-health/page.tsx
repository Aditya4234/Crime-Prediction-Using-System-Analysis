"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { Activity, Cpu, Database, Wifi, HardDrive, Thermometer, CheckCircle, AlertTriangle, Camera, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

const services = [
  { name: "AI Prediction Engine", status: "operational", uptime: "99.97%", latency: "12ms", icon: Cpu },
  { name: "GIS Mapping Service", status: "operational", uptime: "99.99%", latency: "45ms", icon: Activity },
  { name: "ALPR Feed Processor", status: "operational", uptime: "99.95%", latency: "28ms", icon: Camera },
  { name: "Dispatch Radio Gateway", status: "operational", uptime: "99.98%", latency: "8ms", icon: Wifi },
  { name: "Database Cluster (Primary)", status: "operational", uptime: "99.99%", latency: "3ms", icon: Database },
  { name: "Database Cluster (Replica)", status: "degraded", uptime: "99.80%", latency: "15ms", icon: Database },
  { name: "Evidence Storage", status: "operational", uptime: "99.99%", latency: "62ms", icon: HardDrive },
  { name: "Report Generator", status: "operational", uptime: "99.96%", latency: "220ms", icon: Activity },
];

const initialMetrics = [
  { label: "CPU Usage", value: 34 },
  { label: "Memory", value: 67 },
  { label: "Disk I/O", value: 23 },
  { label: "Network", value: 45 },
];

export default function SystemHealthPage() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState(initialMetrics);

  const handleRefresh = () => {
    setMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        value: Math.max(10, Math.min(95, m.value + Math.floor(Math.random() * 11) - 5)),
      }))
    );
    toast("System metrics refreshed", "success");
  };

  return (
    <Shell>
      <PageLayout
        title="SYSTEM HEALTH"
        subtitle="Infrastructure monitoring and service status dashboard"
        icon={Activity}
        actions={
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
                <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">{m.label}</p>
                <p className={`text-2xl font-bold font-mono mt-1 ${m.value > 80 ? "text-cpd-danger" : m.value > 60 ? "text-cpd-warning" : "text-cpd-success"}`}>{m.value}%</p>
                <div className="mt-2 h-1.5 bg-cpd-bg-primary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${m.value > 80 ? "bg-cpd-danger" : m.value > 60 ? "bg-cpd-warning" : "bg-cpd-success"}`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cpd-accent" />
              <span className="text-xs font-bold text-cpd-text">SERVICE STATUS</span>
            </div>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 bg-cpd-bg-primary rounded border border-cpd-border/50 hover:border-cpd-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${s.status === "operational" ? "bg-cpd-success/10" : "bg-cpd-warning/10"}`}>
                      <s.icon className={`w-4 h-4 ${s.status === "operational" ? "text-cpd-success" : "text-cpd-warning"}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-cpd-text">{s.name}</p>
                      <p className="text-[10px] text-cpd-text-dim">Latency: {s.latency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-cpd-text-dim font-mono">{s.uptime} uptime</span>
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${s.status === "operational" ? "bg-cpd-success/20 text-cpd-success" : "bg-cpd-warning/20 text-cpd-warning"}`}>
                      {s.status === "operational" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Thermometer className="w-4 h-4 text-cpd-warning" />
                <span className="text-xs font-bold text-cpd-text">RECENT EVENTS</span>
              </div>
              <div className="space-y-2">
                {[
                  { time: "15:20", event: "AI Engine model hot-reload completed", severity: "info" },
                  { time: "14:55", event: "DB Replica lag increased to 15ms", severity: "warn" },
                  { time: "14:30", event: "ALPR feed reconnected after 2s dropout", severity: "info" },
                  { time: "13:00", event: "Scheduled backup completed successfully", severity: "info" },
                  { time: "12:15", event: "Memory usage spike resolved automatically", severity: "warn" },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-cpd-bg-primary rounded border border-cpd-border/50">
                    <span className="text-[10px] font-mono text-cpd-text-dim w-12 shrink-0">{e.time}</span>
                    <span className="text-xs text-cpd-text flex-1">{e.event}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${e.severity === "info" ? "bg-cpd-accent/20 text-cpd-accent" : "bg-cpd-warning/20 text-cpd-warning"}`}>{e.severity.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">SYSTEM INFO</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Server Uptime", value: "14d 7h 23m" },
                  { label: "Last Deployment", value: "2025-09-20 03:15 UTC" },
                  { label: "Node.js Version", value: "v20.11.0" },
                  { label: "Database Version", value: "PostgreSQL 16.1" },
                  { label: "Total Records", value: "2.4M crime records" },
                  { label: "Storage Used", value: "847 GB / 2 TB" },
                  { label: "Active WebSocket Conns", value: "127" },
                ].map((info) => (
                  <div key={info.label} className="flex items-center justify-between p-2 bg-cpd-bg-primary rounded border border-cpd-border/50">
                    <span className="text-[10px] text-cpd-text-dim">{info.label}</span>
                    <span className="text-[10px] text-cpd-text font-mono font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
