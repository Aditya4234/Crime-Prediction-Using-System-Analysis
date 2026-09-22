"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import {
  TrendingUp, ArrowUp, ArrowDown, Calendar, Download,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { useToast } from "@/components/Toast";

const weeklyTrend = [
  { day: "Mon", robbery: 12, burglary: 18, assault: 15, theft: 28 },
  { day: "Tue", robbery: 10, burglary: 15, assault: 18, theft: 25 },
  { day: "Wed", robbery: 15, burglary: 20, assault: 12, theft: 30 },
  { day: "Thu", robbery: 8, burglary: 14, assault: 20, theft: 22 },
  { day: "Fri", robbery: 18, burglary: 22, assault: 16, theft: 35 },
  { day: "Sat", robbery: 22, burglary: 25, assault: 24, theft: 40 },
  { day: "Sun", robbery: 14, burglary: 16, assault: 14, theft: 28 },
];

const monthlyData = [
  { month: "Jan", total: 245, clearance: 72 },
  { month: "Feb", total: 220, clearance: 75 },
  { month: "Mar", total: 260, clearance: 70 },
  { month: "Apr", total: 235, clearance: 78 },
  { month: "May", total: 280, clearance: 74 },
  { month: "Jun", total: 310, clearance: 71 },
  { month: "Jul", total: 340, clearance: 68 },
  { month: "Aug", total: 295, clearance: 76 },
  { month: "Sep", total: 270, clearance: 80 },
];

const crimeDistribution = [
  { name: "Theft", value: 35, color: "#38BDF8" },
  { name: "Assault", value: 22, color: "#DC2626" },
  { name: "Burglary", value: 20, color: "#F59E0B" },
  { name: "Robbery", value: 15, color: "#8B5CF6" },
  { name: "Other", value: 8, color: "#10B981" },
];

const kpis = [
  { label: "Total Incidents", value: "270", change: "-5.1%", trend: "down", color: "text-cpd-success" },
  { label: "Clearance Rate", value: "80%", change: "+4.2%", trend: "up", color: "text-cpd-success" },
  { label: "Avg Response Time", value: "4.2m", change: "-0.8m", trend: "down", color: "text-cpd-success" },
  { label: "Repeat Offenders", value: "12", change: "+2", trend: "up", color: "text-cpd-danger" },
];

export default function TrendAnalysisPage() {
  const { toast } = useToast();

  const handleExport = () => {
    toast("Trend analysis exported as CSV", "success");
  };

  return (
    <Shell>
      <PageLayout
        title="TREND ANALYSIS"
        subtitle="Historical crime patterns and predictive trend forecasting"
        icon={TrendingUp}
        actions={
          <>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              Last 30 Days
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
                <p className="text-[10px] text-cpd-text-dim uppercase tracking-wider">{kpi.label}</p>
                <p className={`text-2xl font-bold font-mono mt-1 ${kpi.color}`}>{kpi.value}</p>
                <p className={`text-[10px] flex items-center gap-1 mt-1 ${
                  kpi.trend === "down" && kpi.label !== "Repeat Offenders" ? "text-cpd-success" :
                  kpi.trend === "up" && kpi.label === "Clearance Rate" ? "text-cpd-success" :
                  "text-cpd-danger"
                }`}>
                  {kpi.trend === "down" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  {kpi.change} vs last month
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">WEEKLY CRIME TRENDS BY CATEGORY</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                  <Line type="monotone" dataKey="robbery" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} name="Robbery" />
                  <Line type="monotone" dataKey="burglary" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Burglary" />
                  <Line type="monotone" dataKey="assault" stroke="#38BDF8" strokeWidth={2} dot={{ r: 3 }} name="Assault" />
                  <Line type="monotone" dataKey="theft" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Theft" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cpd-warning" />
                <span className="text-xs font-bold text-cpd-text">CRIME DISTRIBUTION</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={crimeDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {crimeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cpd-success" />
              <span className="text-xs font-bold text-cpd-text">MONTHLY INCIDENTS vs CLEARANCE RATE</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="total" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Total Incidents" />
                <Line yAxisId="right" type="monotone" dataKey="clearance" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Clearance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
