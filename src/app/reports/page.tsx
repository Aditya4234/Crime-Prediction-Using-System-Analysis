"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { FileText, Download, Calendar, Clock, Send, Eye } from "lucide-react";
import { useToast } from "@/components/Toast";

const reports = [
  { id: "RPT-001", title: "Daily Shift SitRep — Day Shift", date: "2025-09-20", shift: "Day", status: "ready", type: "SitRep" },
  { id: "RPT-002", title: "Precinct Executive Brief — Week 38", date: "2025-09-20", shift: "All", status: "ready", type: "Executive" },
  { id: "RPT-003", title: "Predictive Deployment — Graveyard", date: "2025-09-20", shift: "Graveyard", status: "generating", type: "Deployment" },
  { id: "RPT-004", title: "Daily Shift SitRep — Swing Shift", date: "2025-09-19", shift: "Swing", status: "ready", type: "SitRep" },
  { id: "RPT-005", title: "Weekly Crime Summary — W38", date: "2025-09-19", shift: "All", status: "ready", type: "Summary" },
  { id: "RPT-006", title: "Incident Investigation Report #CP-2025-0979", date: "2025-09-19", shift: "N/A", status: "ready", type: "Investigation" },
];

const scheduledBriefs = [
  { time: "19:00", title: "Swing-to-Graveyard Shift Handoff Brief", recipients: "All Swing + Graveyard Units" },
  { time: "22:00", title: "Mid-Night Tactical Update", recipients: "Sector Commanders" },
  { time: "06:00", title: "Morning Executive Preview", recipients: "Chief, Deputy Chiefs" },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const handleGenerate = () => {
    toast("Report generation initiated — estimated 30 seconds", "info");
  };

  const handleView = (id: string) => {
    toast(`Opening report ${id}...`, "info");
  };

  const handleDownload = (id: string) => {
    toast(`Downloading ${id} as PDF...`, "success");
  };

  const handleSendBrief = (title: string) => {
    toast(`Briefing "${title}" sent to recipients`, "success");
  };

  return (
    <Shell>
      <PageLayout
        title="REPORTS & SITREPS"
        subtitle="Intelligence reporting, export center, and scheduled briefings"
        icon={FileText}
        actions={
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-accent text-cpd-bg-primary rounded text-xs font-bold hover:bg-cpd-accent/80 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate New Report
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">Today&apos;s Reports</p>
              <p className="text-2xl font-bold font-mono text-cpd-accent mt-1">3</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">This Week</p>
              <p className="text-2xl font-bold font-mono text-cpd-text mt-1">14</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">Scheduled Briefs</p>
              <p className="text-2xl font-bold font-mono text-cpd-warning mt-1">{scheduledBriefs.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-cpd-text mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cpd-accent" />
                AVAILABLE REPORTS
              </h3>
              <div className="space-y-2">
                {reports.map((r) => (
                  <div key={r.id} className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 flex items-center justify-between hover:border-cpd-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        r.type === "SitRep" ? "bg-cpd-accent/20" :
                        r.type === "Executive" ? "bg-cpd-warning/20" :
                        r.type === "Deployment" ? "bg-cpd-success/20" :
                        "bg-cpd-bg-primary"
                      }`}>
                        <FileText className={`w-4 h-4 ${
                          r.type === "SitRep" ? "text-cpd-accent" :
                          r.type === "Executive" ? "text-cpd-warning" :
                          r.type === "Deployment" ? "text-cpd-success" :
                          "text-cpd-text-dim"
                        }`} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-cpd-text">{r.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-cpd-text-dim">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.date}</span>
                          <span>{r.shift}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        r.status === "ready" ? "bg-cpd-success/20 text-cpd-success" : "bg-cpd-warning/20 text-cpd-warning"
                      }`}>{r.status.toUpperCase()}</span>
                      <button onClick={() => handleView(r.id)} className="p-1.5 rounded bg-cpd-bg-primary hover:bg-cpd-accent/10 text-cpd-text-dim hover:text-cpd-accent transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDownload(r.id)} className="p-1.5 rounded bg-cpd-bg-primary hover:bg-cpd-accent/10 text-cpd-text-dim hover:text-cpd-accent transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-cpd-text mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cpd-warning" />
                SCHEDULED BRIEFINGS
              </h3>
              <div className="space-y-2">
                {scheduledBriefs.map((b, i) => (
                  <div key={i} className="bg-cpd-bg-secondary border border-cpd-border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded bg-cpd-warning/10 flex items-center justify-center">
                          <span className="text-xs font-mono font-bold text-cpd-warning">{b.time}</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-cpd-text">{b.title}</p>
                          <p className="text-[10px] text-cpd-text-dim">{b.recipients}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendBrief(b.title)}
                        className="p-1.5 rounded bg-cpd-accent/10 text-cpd-accent hover:bg-cpd-accent/20 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-cpd-bg-secondary border border-cpd-border rounded p-4">
                <h3 className="text-xs font-bold text-cpd-text mb-3">AI EXECUTIVE SUMMARY</h3>
                <div className="bg-cpd-bg-primary rounded p-3 border border-cpd-border/50">
                  <p className="text-xs text-cpd-text leading-relaxed">
                    Crime incidents decreased <span className="text-cpd-success font-bold">5.1%</span> compared to the previous month.
                    Clearance rate improved to <span className="text-cpd-success font-bold">80%</span>, driven by enhanced AI-assisted
                    pattern matching. Robbery incidents spiked <span className="text-cpd-danger font-bold">+18%</span> on Friday-Saturday
                    in the Downtown Core zone. Recommend increased patrol presence in <span className="text-cpd-warning font-bold">ZONE-A7</span>
                    during weekend evening hours. Average response time improved to <span className="text-cpd-success font-bold">4.2 minutes</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
