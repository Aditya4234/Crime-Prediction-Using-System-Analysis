"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { Brain, RefreshCw, Download, Cpu, Database, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

const featureImportance = [
  { feature: "Weather Conditions", importance: 92 },
  { feature: "Historical Patterns", importance: 88 },
  { feature: "Crowd Density", importance: 75 },
  { feature: "Time of Day", importance: 71 },
  { feature: "Day of Week", importance: 65 },
  { feature: "Event Calendar", importance: 58 },
  { feature: "Transit Schedule", importance: 45 },
];

const categoryAccuracy = [
  { category: "Robbery", accuracy: 96 },
  { category: "Burglary", accuracy: 93 },
  { category: "Assault", accuracy: 91 },
  { category: "Grand Theft", accuracy: 94 },
  { category: "Vandalism", accuracy: 89 },
];

const modelMetricsData = [
  { name: "Accuracy", value: 94.2, color: "#38BDF8" },
  { name: "Precision", value: 92.8, color: "#10B981" },
  { name: "Recall", value: 91.5, color: "#F59E0B" },
  { name: "F1-Score", value: 91.0, color: "#8B5CF6" },
];

const driftData = [
  { day: "Day 1", drift: 0.2 }, { day: "Day 5", drift: 0.3 },
  { day: "Day 10", drift: 0.15 }, { day: "Day 15", drift: 0.4 },
  { day: "Day 20", drift: 0.25 }, { day: "Day 25", drift: 0.1 },
  { day: "Day 30", drift: 0.18 },
];

const confusionMatrix = [
  { actual: "Robbery", predicted_robery: 45, predicted_burglary: 2, predicted_assault: 1, predicted_theft: 0 },
  { actual: "Burglary", predicted_robery: 1, predicted_burglary: 38, predicted_assault: 0, predicted_theft: 2 },
  { actual: "Assault", predicted_robery: 0, predicted_burglary: 1, predicted_assault: 42, predicted_theft: 1 },
  { actual: "Theft", predicted_robery: 0, predicted_burglary: 0, predicted_assault: 2, predicted_theft: 55 },
];

export default function PredictiveAnalyticsPage() {
  const { toast } = useToast();
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    toast("Model retraining initiated — this may take 5-10 minutes", "info");
    setTimeout(() => {
      setIsRetraining(false);
      toast("Model retrained successfully — v4.8.3 deployed", "success");
    }, 3000);
  };

  const handleExport = () => {
    toast("Analytics report exported as PDF", "success");
  };

  return (
    <Shell>
      <PageLayout
        title="PREDICTIVE ANALYTICS"
        subtitle="AI Model Performance & ML Governance — XGBoost + LSTM Neural Net v4.8"
        icon={Brain}
        actions={
          <>
            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? "animate-spin" : ""}`} />
              {isRetraining ? "Retraining..." : "Retrain"}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {modelMetricsData.map((m) => (
              <div key={m.name} className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
                <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">{m.name}</p>
                <p className="text-3xl font-bold font-mono mt-1" style={{ color: m.color }}>{m.value}%</p>
                <div className="mt-2 h-1.5 bg-cpd-bg-primary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">30-DAY MODEL DRIFT & CALIBRATION</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={driftData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Area type="monotone" dataKey="drift" stroke="#F59E0B" fill="#F59E0B20" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-cpd-success" />
                <span className="text-xs font-bold text-cpd-text">MODEL METADATA</span>
              </div>
              <div className="space-y-2">
                <div className="bg-cpd-bg-primary rounded p-2">
                  <p className="text-[9px] text-cpd-text-dim">Model Architecture</p>
                  <p className="text-xs text-cpd-text font-medium">XGBoost + LSTM Hybrid</p>
                </div>
                <div className="bg-cpd-bg-primary rounded p-2">
                  <p className="text-[9px] text-cpd-text-dim">Version</p>
                  <p className="text-xs text-cpd-accent font-mono font-medium">v4.8.2-stable</p>
                </div>
                <div className="bg-cpd-bg-primary rounded p-2">
                  <p className="text-[9px] text-cpd-text-dim">Last Trained</p>
                  <p className="text-xs text-cpd-text font-medium">2025-09-20 03:00 UTC</p>
                </div>
                <div className="bg-cpd-bg-primary rounded p-2">
                  <p className="text-[9px] text-cpd-text-dim">Training Samples</p>
                  <p className="text-xs text-cpd-text font-medium">2.4M records</p>
                </div>
                <div className="bg-cpd-bg-primary rounded p-2">
                  <p className="text-[9px] text-cpd-text-dim">ROC-AUC</p>
                  <p className="text-xs text-cpd-success font-mono font-medium">0.96</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cpd-warning" />
                <span className="text-xs font-bold text-cpd-text">FEATURE IMPORTANCE</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis dataKey="feature" type="category" tick={{ fill: "#94A3B8", fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="importance" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-cpd-text">CATEGORY ACCURACY</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} domain={[80, 100]} />
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                    {categoryAccuracy.map((_, i) => (
                      <Cell key={i} fill={["#38BDF8", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-cpd-accent" />
              <span className="text-xs font-bold text-cpd-text">CONFUSION MATRIX — OFFENSE CATEGORIES</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-cpd-border">
                    <th className="text-left py-2 px-3 text-cpd-text-dim">Actual \ Predicted</th>
                    <th className="text-center py-2 px-3 text-cpd-danger">Robbery</th>
                    <th className="text-center py-2 px-3 text-cpd-warning">Burglary</th>
                    <th className="text-center py-2 px-3 text-cpd-accent">Assault</th>
                    <th className="text-center py-2 px-3 text-cpd-success">Theft</th>
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row) => (
                    <tr key={row.actual} className="border-b border-cpd-border/50">
                      <td className="py-2 px-3 text-cpd-text font-medium">{row.actual}</td>
                      <td className={`text-center py-2 px-3 font-mono ${row.predicted_robery > 10 ? "text-cpd-success font-bold" : "text-cpd-text-dim"}`}>{row.predicted_robery}</td>
                      <td className={`text-center py-2 px-3 font-mono ${row.predicted_burglary > 10 ? "text-cpd-success font-bold" : "text-cpd-text-dim"}`}>{row.predicted_burglary}</td>
                      <td className={`text-center py-2 px-3 font-mono ${row.predicted_assault > 10 ? "text-cpd-success font-bold" : "text-cpd-text-dim"}`}>{row.predicted_assault}</td>
                      <td className={`text-center py-2 px-3 font-mono ${row.predicted_theft > 10 ? "text-cpd-success font-bold" : "text-cpd-text-dim"}`}>{row.predicted_theft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-cpd-success" />
              <span className="text-xs font-bold text-cpd-text">ETHICAL COMPLIANCE & AUDIT LOG</span>
            </div>
            <div className="space-y-2">
              {[
                { date: "2025-09-20", event: "Automated bias scan completed — No demographic skew detected", status: "PASS" },
                { date: "2025-09-18", event: "Constitutional compliance audit — All criteria met", status: "PASS" },
                { date: "2025-09-15", event: "Feature fairness review — Weather, time, location only", status: "PASS" },
                { date: "2025-09-12", event: "Model retrained with updated 2025 Q3 dataset", status: "LOG" },
                { date: "2025-09-10", event: "Drift alert triggered — Recalibration scheduled", status: "WARN" },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-cpd-bg-primary rounded border border-cpd-border/50">
                  <span className="text-[10px] text-cpd-text-dim font-mono w-20 shrink-0">{log.date}</span>
                  <span className="text-xs text-cpd-text flex-1">{log.event}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    log.status === "PASS" ? "bg-cpd-success/20 text-cpd-success" :
                    log.status === "WARN" ? "bg-cpd-warning/20 text-cpd-warning" :
                    "bg-cpd-accent/20 text-cpd-accent"
                  }`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
