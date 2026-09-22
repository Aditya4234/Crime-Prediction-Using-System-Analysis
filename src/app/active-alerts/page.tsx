"use client";

import Shell from "@/components/Shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import { AlertTriangle, MapPin, Clock, Send, Shield, Radio, Loader2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";

interface Alert {
  id: string;
  code: string;
  type: string;
  location: string;
  time: string;
  priority: "critical" | "high" | "medium";
  units: string[];
  status: string;
}

const alertCodes = ["CODE-1", "CODE-2", "CODE-3"];

export default function ActiveAlertsPage() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "CODE-3",
    type: "",
    location: "",
    priority: "critical" as "critical" | "high" | "medium",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get<Alert[]>("/alerts");
      if (response.success && response.data) {
        setAlerts(response.data || []);
      }
    } catch (error) {
      toast("Failed to fetch alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.priority === filter);

  const handleDispatch = (alert: Alert) => {
    toast(`Units dispatched for ${alert.code} - ${alert.type}`, "success");
  };

  const handleEscalate = async (alert: Alert) => {
    try {
      await api.patch(`/alerts/${alert.id}/status`, { status: "responding" });
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, priority: "critical" } : a
        )
      );
      toast(`Alert ${alert.id} escalated to CRITICAL`, "error");
    } catch (error) {
      toast("Failed to escalate alert", "error");
    }
  };

  const handleRadio = (alert: Alert) => {
    toast(`Radio channel opened for ${alert.units.join(", ")}`, "info");
  };

  const handleResolve = async (alert: Alert) => {
    try {
      await api.patch(`/alerts/${alert.id}/status`, { status: "resolved" });
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, status: "resolved" } : a
        )
      );
      toast(`Alert ${alert.id} resolved`, "success");
    } catch (error) {
      toast("Failed to resolve alert", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.location) {
      toast("Please fill all required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post<Alert>("/alerts", formData);
      if (response.success && response.data) {
        setAlerts((prev) => [response.data!, ...prev]);
        setShowModal(false);
        setFormData({ code: "CODE-3", type: "", location: "", priority: "critical" });
        toast("Alert created successfully!", "success");
      }
    } catch (error) {
      toast("Failed to create alert", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Shell>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-cpd-accent animate-spin" />
          </div>
        </Shell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Shell>
        <PageLayout
          title="ACTIVE ALERTS"
          subtitle="Real-time Code-3 alerts and incident dispatching"
          icon={AlertTriangle}
          actions={
            <div className="flex items-center gap-1">
              {["all", "critical", "high", "medium"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${filter === f ? "bg-cpd-accent text-cpd-bg-primary" : "bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-text"}`}>{f.toUpperCase()}</button>
              ))}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-cpd-danger text-white rounded text-xs font-bold hover:bg-cpd-danger/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                NEW ALERT
              </button>
            </div>
          }
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-cpd-bg-secondary border border-cpd-danger/30 rounded p-3">
              <p className="text-[10px] text-cpd-danger">CRITICAL</p>
              <p className="text-lg font-bold text-cpd-danger">{alerts.filter(a => a.priority === "critical").length}</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-warning/30 rounded p-3">
              <p className="text-[10px] text-cpd-warning">HIGH</p>
              <p className="text-lg font-bold text-cpd-warning">{alerts.filter(a => a.priority === "high").length}</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-success/30 rounded p-3">
              <p className="text-[10px] text-cpd-success">MEDIUM</p>
              <p className="text-lg font-bold text-cpd-success">{alerts.filter(a => a.priority === "medium").length}</p>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-cpd-text-dim">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No alerts found</p>
              </div>
            ) : (
              filtered.map((alert) => (
                <div key={alert.id} className={`border rounded p-3 sm:p-4 ${alert.priority === "critical" ? "border-cpd-danger/50 bg-cpd-danger/5" : alert.priority === "high" ? "border-cpd-warning/50 bg-cpd-warning/5" : "border-cpd-border bg-cpd-bg-secondary"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${alert.priority === "critical" ? "bg-cpd-danger animate-pulse-glow" : alert.priority === "high" ? "bg-cpd-warning" : "bg-cpd-success"}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-cpd-danger">{alert.code}</span>
                          <span className="text-sm font-bold text-cpd-text">{alert.type}</span>
                        </div>
                        <p className="text-xs text-cpd-text-dim flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{alert.location}</span></p>
                        <p className="text-[10px] text-cpd-text-dim flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 shrink-0" />{alert.time}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {alert.units.map((u) => (<span key={u} className="text-[9px] px-1.5 py-0.5 bg-cpd-accent/10 text-cpd-accent rounded font-mono">{u}</span>))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap ${alert.status === "responding" ? "bg-cpd-warning/20 text-cpd-warning" : alert.status === "contained" ? "bg-cpd-accent/20 text-cpd-accent" : "bg-cpd-success/20 text-cpd-success"}`}>{alert.status.toUpperCase()}</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleDispatch(alert)} className="p-1.5 bg-cpd-accent text-cpd-bg-primary rounded hover:bg-cpd-accent/80 transition-colors" title="Dispatch"><Send className="w-3 h-3" /></button>
                        <button onClick={() => handleEscalate(alert)} className="p-1.5 bg-cpd-danger/20 text-cpd-danger rounded hover:bg-cpd-danger/30 transition-colors" title="Escalate"><Shield className="w-3 h-3" /></button>
                        <button onClick={() => handleRadio(alert)} className="p-1.5 bg-cpd-warning/20 text-cpd-warning rounded hover:bg-cpd-warning/30 transition-colors" title="Radio"><Radio className="w-3 h-3" /></button>
                        <button onClick={() => handleResolve(alert)} className="p-1.5 bg-cpd-success/20 text-cpd-success rounded hover:bg-cpd-success/30 transition-colors" title="Resolve"><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageLayout>

        {/* New Alert Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b border-cpd-border">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-cpd-danger" />
                  <h2 className="text-lg font-bold text-cpd-text">NEW ALERT</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-cpd-bg-primary rounded text-cpd-text-dim hover:text-cpd-text">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-cpd-text-dim mb-1">Alert Code *</label>
                    <select
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text focus:outline-none focus:border-cpd-accent"
                    >
                      {alertCodes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cpd-text-dim mb-1">Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text focus:outline-none focus:border-cpd-accent"
                    >
                      <option value="critical">CRITICAL</option>
                      <option value="high">HIGH</option>
                      <option value="medium">MEDIUM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Alert Type *</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., ARMED ROBBERY, ASSAULT IN PROGRESS"
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter location..."
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text hover:bg-cpd-bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-cpd-danger text-white rounded text-sm font-bold hover:bg-cpd-danger/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        CREATE ALERT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Shell>
    </ProtectedRoute>
  );
}
