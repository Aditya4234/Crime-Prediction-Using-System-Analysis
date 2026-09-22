"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Radio,
  Send,
  Clock,
  MapPin,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
  Car,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface Alert {
  id: string;
  code: string;
  type: string;
  location: string;
  time: string;
  priority: "critical" | "high" | "medium";
  unitsAssigned: string[];
  status: "active" | "responding" | "contained";
}

const activeAlerts: Alert[] = [
  {
    id: "ALT-001", code: "CODE-3", type: "ARMED ROBBERY", location: "142 Main St, Downtown", time: "2 min ago",
    priority: "critical", unitsAssigned: ["UNIT-22", "UNIT-05"], status: "responding",
  },
  {
    id: "ALT-002", code: "CODE-2", type: "ASSAULT IN PROGRESS", location: "88 Market Ave", time: "5 min ago",
    priority: "high", unitsAssigned: ["UNIT-14"], status: "responding",
  },
  {
    id: "ALT-003", code: "CODE-1", type: "BURGLARY ALARM", location: "2200 Oak Blvd", time: "12 min ago",
    priority: "medium", unitsAssigned: ["UNIT-07"], status: "contained",
  },
];

const riskHotspots = [
  { name: "Downtown Core", risk: 94, trend: "up", incidents: 8 },
  { name: "Transit Hub", risk: 87, trend: "up", incidents: 5 },
  { name: "Market District", risk: 82, trend: "stable", incidents: 6 },
];

export default function TriageDrawer() {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(activeAlerts[0].id);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { toast } = useToast();

  const handleDispatch = (alert: Alert) => {
    toast(`Units dispatched for ${alert.code}`, "success");
  };

  const handleEscalate = (alert: Alert) => {
    toast(`Alert ${alert.id} escalated to CRITICAL`, "error");
  };

  const handleRadio = (alert: Alert) => {
    toast(`Radio channel opened for ${alert.unitsAssigned.join(", ")}`, "info");
  };

  return (
    <div
      className={`flex flex-col bg-cpd-bg-secondary/60 backdrop-blur-xl border-l border-cpd-border-subtle transition-all duration-300 ease-out ${
        drawerOpen ? "w-72" : "w-10"
      }`}
    >
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="flex items-center justify-center h-10 border-b border-cpd-border-subtle hover:bg-cpd-bg-primary text-cpd-text-muted hover:text-cpd-accent transition-colors"
      >
        {drawerOpen ? <ChevronDown className="w-4 h-4 rotate-[-90deg]" /> : <ChevronUp className="w-4 h-4 rotate-[90deg]" />}
      </button>

      {drawerOpen && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-3 border-b border-cpd-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-cpd-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-cpd-danger" />
              </div>
              <span className="text-[11px] font-bold text-cpd-danger tracking-wider">CODE-3 ALERTS</span>
              <span className="ml-auto w-5 h-5 bg-cpd-danger text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-pulse-glow shadow-lg shadow-cpd-danger/30">
                {activeAlerts.filter((a) => a.priority === "critical").length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg transition-all duration-200 ${
                  alert.priority === "critical"
                    ? "bg-cpd-danger/5 border border-cpd-danger/20"
                    : alert.priority === "high"
                    ? "bg-cpd-warning/5 border border-cpd-warning/20"
                    : "bg-cpd-bg-primary/40 border border-cpd-border-subtle"
                }`}
              >
                <button
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                  className="w-full p-2.5 flex items-start gap-2 text-left"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.priority === "critical"
                      ? "bg-cpd-danger animate-pulse-glow"
                      : alert.priority === "high"
                      ? "bg-cpd-warning"
                      : "bg-cpd-success"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-cpd-danger">{alert.code}</span>
                      <span className="text-[10px] text-cpd-text-muted">|</span>
                      <span className="text-[10px] font-semibold text-cpd-text truncate">{alert.type}</span>
                    </div>
                    <p className="text-[10px] text-cpd-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />{alert.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-cpd-text-muted flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{alert.time}
                      </span>
                      <span className={`badge ${
                        alert.status === "responding" ? "badge-warning" :
                        alert.status === "contained" ? "badge-accent" : "badge-success"
                      }`}>{alert.status.toUpperCase()}</span>
                    </div>
                  </div>
                  {expandedAlert === alert.id ? (
                    <ChevronUp className="w-3 h-3 text-cpd-text-muted mt-1 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-cpd-text-muted mt-1 shrink-0" />
                  )}
                </button>

                {expandedAlert === alert.id && (
                  <div className="px-2.5 pb-2.5 border-t border-cpd-border-subtle/50 pt-2 space-y-2 animate-fade-in">
                    <div>
                      <p className="text-[9px] text-cpd-text-muted uppercase mb-1 font-medium">Units Assigned</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.unitsAssigned.map((u) => (
                          <span key={u} className="badge badge-accent font-mono">{u}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDispatch(alert)}
                        className="flex-1 btn btn-primary text-[10px] py-1.5"
                      >
                        <Send className="w-3 h-3" />
                        DISPATCH
                      </button>
                      <button
                        onClick={() => handleEscalate(alert)}
                        className="btn btn-danger text-[10px] py-1.5 px-2"
                      >
                        <Shield className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRadio(alert)}
                        className="btn btn-ghost text-[10px] py-1.5 px-2 text-cpd-warning border-cpd-warning/20 hover:bg-cpd-warning/10"
                      >
                        <Radio className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-cpd-border-subtle">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-cpd-warning/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-cpd-warning" />
                </div>
                <span className="text-[11px] font-bold text-cpd-warning tracking-wider">RISK HOTSPOTS</span>
              </div>
              <div className="space-y-1">
                {riskHotspots.map((h) => (
                  <div key={h.name} className="flex items-center gap-2 p-2 bg-cpd-bg-primary/40 rounded-lg border border-cpd-border-subtle">
                    <div className={`w-2 h-2 rounded-full ${h.risk >= 85 ? "bg-cpd-danger" : h.risk >= 70 ? "bg-cpd-warning" : "bg-cpd-success"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-cpd-text font-medium truncate">{h.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-cpd-text-dim">{h.risk}%</span>
                        <span className={`text-[9px] ${h.trend === "up" ? "text-cpd-danger" : "text-cpd-success"}`}>
                          {h.trend === "up" ? "▲" : "▼"}
                        </span>
                        <span className="text-[9px] text-cpd-text-muted">{h.incidents} incidents</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-cpd-border-subtle p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-cpd-accent/10 flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-cpd-accent" />
              </div>
              <span className="text-[11px] font-bold text-cpd-text tracking-wider">UNIT STATUS</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { value: "42", label: "ACTIVE", color: "text-cpd-accent" },
                { value: "3", label: "RESPONDING", color: "text-cpd-warning" },
                { value: "1", label: "STAGING", color: "text-cpd-danger" },
                { value: "38", label: "PATROL", color: "text-cpd-success" },
              ].map((s) => (
                <div key={s.label} className="bg-cpd-bg-primary/40 rounded-lg p-2 text-center border border-cpd-border-subtle">
                  <p className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-cpd-text-muted font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
