"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Brain, AlertTriangle, Target } from "lucide-react";

const hourlyData = [
  { hour: "00", actual: 12, predicted: 14, baseline: 10 },
  { hour: "01", actual: 8, predicted: 10, baseline: 7 },
  { hour: "02", actual: 5, predicted: 6, baseline: 4 },
  { hour: "03", actual: 3, predicted: 4, baseline: 3 },
  { hour: "04", actual: 2, predicted: 3, baseline: 2 },
  { hour: "05", actual: 4, predicted: 5, baseline: 3 },
  { hour: "06", actual: 9, predicted: 8, baseline: 7 },
  { hour: "07", actual: 15, predicted: 14, baseline: 12 },
  { hour: "08", actual: 22, predicted: 20, baseline: 18 },
  { hour: "09", actual: 28, predicted: 26, baseline: 22 },
  { hour: "10", actual: 31, predicted: 30, baseline: 25 },
  { hour: "11", actual: 35, predicted: 33, baseline: 28 },
  { hour: "12", actual: 42, predicted: 40, baseline: 35 },
  { hour: "13", actual: 38, predicted: 37, baseline: 32 },
  { hour: "14", actual: 45, predicted: 43, baseline: 38 },
  { hour: "15", actual: 52, predicted: 50, baseline: 42 },
  { hour: "16", actual: 58, predicted: 55, baseline: 48 },
  { hour: "17", actual: 65, predicted: 62, baseline: 55 },
  { hour: "18", actual: 72, predicted: 70, baseline: 60 },
  { hour: "19", actual: 68, predicted: 66, baseline: 58 },
  { hour: "20", actual: 55, predicted: 58, baseline: 48 },
  { hour: "21", actual: 48, predicted: 50, baseline: 40 },
  { hour: "22", actual: 35, predicted: 38, baseline: 30 },
  { hour: "23", actual: 22, predicted: 25, baseline: 18 },
];

const crimeBreakdown = [
  { category: "Robbery", count: 18, predicted: 21 },
  { category: "Burglary", count: 32, predicted: 28 },
  { category: "Assault", count: 24, predicted: 26 },
  { category: "Theft", count: 45, predicted: 42 },
  { category: "Vandalism", count: 15, predicted: 12 },
];

const kpiData = [
  { label: "Active Incidents", value: "23", change: "+3", color: "text-cpd-danger", glow: "shadow-cpd-danger/10" },
  { label: "Predicted Risk", value: "HIGH", change: "87%", color: "text-cpd-warning", glow: "shadow-cpd-warning/10" },
  { label: "Response Time", value: "4.2m", change: "-0.8m", color: "text-cpd-success", glow: "shadow-cpd-success/10" },
  { label: "Model Accuracy", value: "94.2%", change: "+1.1%", color: "text-cpd-accent", glow: "shadow-cpd-accent/10" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg p-2.5 shadow-xl border border-cpd-border-subtle">
        <p className="text-[10px] text-cpd-text-muted mb-1 font-medium">{`${label}:00 hrs`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[11px]" style={{ color: entry.color }}>
            {entry.name}: <span className="font-mono font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PredictiveCharts() {
  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiData.map((kpi, i) => (
          <div
            key={kpi.label}
            className="card p-3.5 group hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className="text-[10px] text-cpd-text-muted uppercase tracking-wider font-medium">{kpi.label}</p>
            <p className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${kpi.color}`}>{kpi.value}</p>
            <p className={`text-[10px] mt-1 font-medium ${kpi.change.startsWith("-") ? "text-cpd-success" : "text-cpd-warning"}`}>
              {kpi.change} from yesterday
            </p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cpd-accent/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cpd-accent" />
            </div>
            <h3 className="text-[13px] font-semibold text-cpd-text">24-Hour Crime Trend vs Neural Projection</h3>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded bg-cpd-accent inline-block" /><span className="text-cpd-text-dim">Actual</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded bg-cpd-danger inline-block" /><span className="text-cpd-text-dim">Predicted</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded bg-cpd-text-muted inline-block" /><span className="text-cpd-text-dim">Baseline</span></span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="hour" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1E293B" }} />
            <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1E293B" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="actual" stroke="#38BDF8" fill="url(#actualGrad)" strokeWidth={2} name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#EF4444" fill="url(#predictedGrad)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
            <Line type="monotone" dataKey="baseline" stroke="#475569" strokeWidth={1} strokeDasharray="2 2" dot={false} name="Baseline" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cpd-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-cpd-warning" />
            </div>
            <h3 className="text-[13px] font-semibold text-cpd-text">Crime Category Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={crimeBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} />
              <YAxis dataKey="category" type="category" tick={{ fill: "#64748B", fontSize: 10 }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#38BDF8" radius={[0, 4, 4, 0]} name="Actual" />
              <Bar dataKey="predicted" fill="#EF4444" radius={[0, 4, 4, 0]} name="Predicted" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cpd-accent/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-cpd-accent" />
            </div>
            <h3 className="text-[13px] font-semibold text-cpd-text">Weekly Risk Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hourlyData.filter((_, i) => i % 4 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="hour" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1E293B" }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1E293B" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="predicted" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} name="Risk Index" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cpd-danger/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-cpd-danger" />
          </div>
          <h3 className="text-[13px] font-semibold text-cpd-text">Top Risk Zones — Next 6 Hours</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { zone: "ZONE-A7 (Downtown Core)", risk: 94, incidents: 8 },
            { zone: "ZONE-C3 (Transit Hub)", risk: 87, incidents: 5 },
            { zone: "ZONE-B12 (Market District)", risk: 82, incidents: 6 },
            { zone: "ZONE-D5 (Industrial Park)", risk: 76, incidents: 3 },
            { zone: "ZONE-E9 (University Area)", risk: 71, incidents: 4 },
            { zone: "ZONE-F2 (Residential North)", risk: 65, incidents: 2 },
          ].map((zone) => (
            <div key={zone.zone} className="card-interactive p-2.5">
              <p className="text-[10px] text-cpd-text font-medium">{zone.zone}</p>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${zone.risk >= 85 ? "bg-cpd-danger animate-pulse-glow" : zone.risk >= 70 ? "bg-cpd-warning" : "bg-cpd-success"}`} />
                  <span className="text-[11px] font-mono font-bold text-cpd-text">{zone.risk}%</span>
                </div>
                <span className="text-[10px] text-cpd-text-muted">{zone.incidents} predicted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
