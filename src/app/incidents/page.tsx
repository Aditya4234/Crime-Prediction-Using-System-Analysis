"use client";

import Shell from "@/components/Shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import { Shield, MapPin, Clock, User, Search, Eye, Loader2, Plus, X, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";

interface Incident {
  id: string;
  type: string;
  status: string;
  severity: string;
  date: string;
  location: string;
  victim: string;
  suspect: string;
  officer: string;
  evidence: number;
  witnesses: number;
  description?: string;
}

const incidentTypes = [
  "Armed Robbery", "Assault", "Burglary", "Grand Theft Auto",
  "Vandalism", "Domestic Disturbance", "Kidnapping", "Murder",
  "Drug Offense", "Fracy", "Hit and Run", "Trespassing"
];

const severityLevels = ["critical", "high", "medium", "low"];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Incident | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    severity: "medium",
    location: "",
    victim: "",
    suspect: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await api.get<Incident[]>("/incidents");
      if (response.success && response.data) {
        setIncidents(response.data);
      }
    } catch (error) {
      toast("Failed to fetch incidents", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = incidents.filter((i) => {
    const matchSearch = i.id.toLowerCase().includes(search.toLowerCase()) || 
                        i.type.toLowerCase().includes(search.toLowerCase()) ||
                        i.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.location || !formData.victim) {
      toast("Please fill all required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post<Incident>("/incidents", formData);
      if (response.success && response.data) {
        setIncidents((prev) => [response.data!, ...prev]);
        setShowModal(false);
        setFormData({ type: "", severity: "medium", location: "", victim: "", suspect: "", description: "" });
        toast("Incident created successfully!", "success");
      }
    } catch (error) {
      toast("Failed to create incident", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    
    try {
      const response = await api.delete(`/incidents/${id}`);
      if (response.success) {
        setIncidents((prev) => prev.filter((i) => i.id !== id));
        toast("Incident deleted", "success");
      }
    } catch (error) {
      toast("Failed to delete incident", "error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await api.put(`/incidents/${id}`, { status: newStatus });
      if (response.success && response.data) {
        setIncidents((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus } : i));
        toast(`Incident status updated to ${newStatus}`, "success");
      }
    } catch (error) {
      toast("Failed to update status", "error");
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
          title="INCIDENTS"
          subtitle="Active case management and investigation dossier"
          icon={Shield}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cpd-text-dim" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cases..."
                  className="pl-7 pr-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent w-48"
                />
              </div>
              {["all", "active", "investigating", "closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                    statusFilter === s ? "bg-cpd-accent text-cpd-bg-primary" : "bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-text"
                  }`}
                >{s.toUpperCase()}</button>
              ))}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-cpd-accent text-cpd-bg-primary rounded text-xs font-bold hover:bg-cpd-accent/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                NEW INCIDENT
              </button>
            </div>
          }
        >
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3">
              <p className="text-[10px] text-cpd-text-dim">TOTAL</p>
              <p className="text-lg font-bold text-cpd-text">{incidents.length}</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-danger/30 rounded p-3">
              <p className="text-[10px] text-cpd-danger">ACTIVE</p>
              <p className="text-lg font-bold text-cpd-danger">{incidents.filter(i => i.status === "active").length}</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-warning/30 rounded p-3">
              <p className="text-[10px] text-cpd-warning">INVESTIGATING</p>
              <p className="text-lg font-bold text-cpd-warning">{incidents.filter(i => i.status === "investigating").length}</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-success/30 rounded p-3">
              <p className="text-[10px] text-cpd-success">CLOSED</p>
              <p className="text-lg font-bold text-cpd-success">{incidents.filter(i => i.status === "closed" || i.status === "resolved").length}</p>
            </div>
          </div>

          {/* Incidents List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-cpd-text-dim">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No incidents found</p>
              </div>
            ) : (
              filtered.map((inc) => (
                <div key={inc.id} className="bg-cpd-bg-secondary border border-cpd-border rounded p-4 hover:border-cpd-accent/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${
                        inc.severity === "critical" ? "bg-cpd-danger/20" :
                        inc.severity === "high" ? "bg-cpd-warning/20" :
                        inc.severity === "medium" ? "bg-cpd-accent/20" : "bg-cpd-success/20"
                      }`}>
                        <Shield className={`w-5 h-5 ${
                          inc.severity === "critical" ? "text-cpd-danger" :
                          inc.severity === "high" ? "text-cpd-warning" :
                          inc.severity === "medium" ? "text-cpd-accent" : "text-cpd-success"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cpd-accent">{inc.id}</span>
                          <span className="text-sm font-bold text-cpd-text">{inc.type}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-[10px] text-cpd-text-dim">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inc.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{inc.date}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{inc.officer}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          <div className="bg-cpd-bg-primary rounded p-2">
                            <p className="text-[9px] text-cpd-text-dim">Victim</p>
                            <p className="text-[10px] text-cpd-text">{inc.victim}</p>
                          </div>
                          <div className="bg-cpd-bg-primary rounded p-2">
                            <p className="text-[9px] text-cpd-text-dim">Suspect</p>
                            <p className="text-[10px] text-cpd-text">{inc.suspect}</p>
                          </div>
                          <div className="bg-cpd-bg-primary rounded p-2">
                            <p className="text-[9px] text-cpd-text-dim">Evidence / Witnesses</p>
                            <p className="text-[10px] text-cpd-text">{inc.evidence} items / {inc.witnesses} witnesses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <select
                        value={inc.status}
                        onChange={(e) => handleStatusChange(inc.id, e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded font-medium cursor-pointer ${
                          inc.status === "active" ? "bg-cpd-danger/20 text-cpd-danger" :
                          inc.status === "investigating" ? "bg-cpd-warning/20 text-cpd-warning" :
                          "bg-cpd-success/20 text-cpd-success"
                        }`}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="investigating">INVESTIGATING</option>
                        <option value="closed">CLOSED</option>
                        <option value="resolved">RESOLVED</option>
                      </select>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShowDetail(inc)}
                          className="p-1.5 rounded bg-cpd-bg-primary hover:bg-cpd-accent/10 text-cpd-text-dim hover:text-cpd-accent transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inc.id)}
                          className="p-1.5 rounded bg-cpd-bg-primary hover:bg-cpd-danger/10 text-cpd-text-dim hover:text-cpd-danger transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageLayout>

        {/* New Incident Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-cpd-border">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cpd-accent" />
                  <h2 className="text-lg font-bold text-cpd-text">NEW INCIDENT</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-cpd-bg-primary rounded text-cpd-text-dim hover:text-cpd-text">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Incident Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text focus:outline-none focus:border-cpd-accent"
                    required
                  >
                    <option value="">Select type...</option>
                    {incidentTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Severity *</label>
                  <div className="flex gap-2">
                    {severityLevels.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: s })}
                        className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                          formData.severity === s
                            ? s === "critical" ? "bg-cpd-danger text-white"
                              : s === "high" ? "bg-cpd-warning text-white"
                              : s === "medium" ? "bg-cpd-accent text-cpd-bg-primary"
                              : "bg-cpd-success text-white"
                            : "bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-text"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
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

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Victim *</label>
                  <input
                    type="text"
                    value={formData.victim}
                    onChange={(e) => setFormData({ ...formData, victim: e.target.value })}
                    placeholder="Enter victim name..."
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Suspect</label>
                  <input
                    type="text"
                    value={formData.suspect}
                    onChange={(e) => setFormData({ ...formData, suspect: e.target.value })}
                    placeholder="Enter suspect info..."
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cpd-text-dim mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter incident description..."
                    rows={3}
                    className="w-full px-3 py-2 bg-cpd-bg-primary border border-cpd-border rounded text-sm text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent resize-none"
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
                    className="flex-1 py-2 bg-cpd-accent text-cpd-bg-primary rounded text-sm font-bold hover:bg-cpd-accent/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        CREATE INCIDENT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b border-cpd-border">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cpd-accent" />
                  <h2 className="text-lg font-bold text-cpd-text">{showDetail.id}</h2>
                </div>
                <button onClick={() => setShowDetail(null)} className="p-1 hover:bg-cpd-bg-primary rounded text-cpd-text-dim hover:text-cpd-text">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    showDetail.severity === "critical" ? "bg-cpd-danger/20 text-cpd-danger" :
                    showDetail.severity === "high" ? "bg-cpd-warning/20 text-cpd-warning" :
                    showDetail.severity === "medium" ? "bg-cpd-accent/20 text-cpd-accent" :
                    "bg-cpd-success/20 text-cpd-success"
                  }`}>{showDetail.severity.toUpperCase()}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    showDetail.status === "active" ? "bg-cpd-danger/20 text-cpd-danger" :
                    showDetail.status === "investigating" ? "bg-cpd-warning/20 text-cpd-warning" :
                    "bg-cpd-success/20 text-cpd-success"
                  }`}>{showDetail.status.toUpperCase()}</span>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-cpd-text">{showDetail.type}</h3>
                  <p className="text-xs text-cpd-text-dim flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />{showDetail.location}
                  </p>
                  <p className="text-xs text-cpd-text-dim flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />{showDetail.date}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cpd-bg-primary rounded p-3">
                    <p className="text-[10px] text-cpd-text-dim">Victim</p>
                    <p className="text-xs text-cpd-text font-medium">{showDetail.victim}</p>
                  </div>
                  <div className="bg-cpd-bg-primary rounded p-3">
                    <p className="text-[10px] text-cpd-text-dim">Suspect</p>
                    <p className="text-xs text-cpd-text font-medium">{showDetail.suspect || "Unknown"}</p>
                  </div>
                  <div className="bg-cpd-bg-primary rounded p-3">
                    <p className="text-[10px] text-cpd-text-dim">Assigned Officer</p>
                    <p className="text-xs text-cpd-text font-medium">{showDetail.officer}</p>
                  </div>
                  <div className="bg-cpd-bg-primary rounded p-3">
                    <p className="text-[10px] text-cpd-text-dim">Evidence / Witnesses</p>
                    <p className="text-xs text-cpd-text font-medium">{showDetail.evidence} items / {showDetail.witnesses} witnesses</p>
                  </div>
                </div>

                {showDetail.description && (
                  <div className="bg-cpd-bg-primary rounded p-3">
                    <p className="text-[10px] text-cpd-text-dim">Description</p>
                    <p className="text-xs text-cpd-text">{showDetail.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Shell>
    </ProtectedRoute>
  );
}
