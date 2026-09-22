"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { Crosshair, MapPin, TrendingUp, Shield, Radio } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/Toast";

const zones = [
  { id: "A7", name: "Downtown Core", risk: 94, trend: "up", incidents: 12, patrols: 8, predicted: 15, topCrime: "Robbery", lat: "34.0522", lng: "-118.2437" },
  { id: "C3", name: "Transit Hub", risk: 87, trend: "up", incidents: 8, patrols: 5, predicted: 10, topCrime: "Pickpocket", lat: "34.0550", lng: "-118.2470" },
  { id: "B12", name: "Market District", risk: 82, trend: "stable", incidents: 7, patrols: 6, predicted: 8, topCrime: "Burglary", lat: "34.0490", lng: "-118.2400" },
  { id: "D5", name: "Industrial Park", risk: 76, trend: "down", incidents: 4, patrols: 3, predicted: 5, topCrime: "Vandalism", lat: "34.0580", lng: "-118.2510" },
  { id: "E9", name: "University Area", risk: 71, trend: "stable", incidents: 5, patrols: 4, predicted: 6, topCrime: "Theft", lat: "34.0510", lng: "-118.2380" },
  { id: "F2", name: "Residential North", risk: 65, trend: "down", incidents: 3, patrols: 2, predicted: 3, topCrime: "Burglary", lat: "34.0570", lng: "-118.2490" },
  { id: "G8", name: "Entertainment District", risk: 58, trend: "up", incidents: 6, patrols: 4, predicted: 7, topCrime: "Assault", lat: "34.0480", lng: "-118.2440" },
  { id: "H4", name: "Waterfront", risk: 42, trend: "stable", incidents: 2, patrols: 2, predicted: 2, topCrime: "Vandalism", lat: "34.0530", lng: "-118.2460" },
];

const zoneComparison = zones.map((z) => ({ name: `Zone ${z.id}`, risk: z.risk, incidents: z.incidents, predicted: z.predicted }));

export default function TargetZonesPage() {
  const { toast } = useToast();

  const handleDeployPatrol = (zoneId: string) => {
    toast(`Patrol unit dispatched to ZONE-${zoneId}`, "success");
  };

  return (
    <Shell>
      <PageLayout
        title="TARGET ZONES"
        subtitle="Geographic risk assessment and zone-based deployment intelligence"
        icon={Crosshair}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
              <p className="text-2xl font-bold font-mono text-cpd-accent">{zones.length}</p>
              <p className="text-[10px] text-cpd-text-dim">ACTIVE ZONES</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
              <p className="text-2xl font-bold font-mono text-cpd-danger">{zones.filter((z) => z.risk >= 80).length}</p>
              <p className="text-[10px] text-cpd-text-dim">HIGH RISK</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
              <p className="text-2xl font-bold font-mono text-cpd-warning">{zones.filter((z) => z.trend === "up").length}</p>
              <p className="text-[10px] text-cpd-text-dim">TRENDING UP</p>
            </div>
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
              <p className="text-2xl font-bold font-mono text-cpd-text">{zones.reduce((a, z) => a + z.patrols, 0)}</p>
              <p className="text-[10px] text-cpd-text-dim">UNITS DEPLOYED</p>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cpd-accent" />
              <span className="text-xs font-bold text-cpd-text">ZONE RISK COMPARISON</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={zoneComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 6, fontSize: 11 }} />
                <Bar dataKey="risk" fill="#DC2626" radius={[4, 4, 0, 0]} name="Risk %" />
                <Bar dataKey="predicted" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Predicted Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {zones.map((z) => (
              <div key={z.id} className={`bg-cpd-bg-secondary border rounded p-4 hover:border-cpd-accent/30 transition-colors ${
                z.risk >= 85 ? "border-cpd-danger/50" : z.risk >= 70 ? "border-cpd-warning/50" : "border-cpd-border"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${
                      z.risk >= 85 ? "bg-cpd-danger/20" : z.risk >= 70 ? "bg-cpd-warning/20" : "bg-cpd-success/20"
                    }`}>
                      <Crosshair className={`w-5 h-5 ${
                        z.risk >= 85 ? "text-cpd-danger" : z.risk >= 70 ? "text-cpd-warning" : "text-cpd-success"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-cpd-text">ZONE-{z.id}</span>
                        <span className="text-xs text-cpd-text-dim">{z.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-cpd-text-dim">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{z.lat}, {z.lng}</span>
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{z.patrols} units</span>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <div className="bg-cpd-bg-primary rounded px-2 py-1">
                          <p className="text-[9px] text-cpd-text-dim">Top Crime</p>
                          <p className="text-[10px] text-cpd-text font-medium">{z.topCrime}</p>
                        </div>
                        <div className="bg-cpd-bg-primary rounded px-2 py-1">
                          <p className="text-[9px] text-cpd-text-dim">Incidents</p>
                          <p className="text-[10px] text-cpd-text font-mono font-medium">{z.incidents}</p>
                        </div>
                        <div className="bg-cpd-bg-primary rounded px-2 py-1">
                          <p className="text-[9px] text-cpd-text-dim">Predicted (6h)</p>
                          <p className="text-[10px] text-cpd-warning font-mono font-medium">{z.predicted}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-2xl font-bold font-mono ${
                      z.risk >= 85 ? "text-cpd-danger" : z.risk >= 70 ? "text-cpd-warning" : "text-cpd-success"
                    }`}>{z.risk}%</p>
                    <span className={`text-[10px] ${
                      z.trend === "up" ? "text-cpd-danger" : z.trend === "down" ? "text-cpd-success" : "text-cpd-text-dim"
                    }`}>{z.trend === "up" ? "▲ Rising" : z.trend === "down" ? "▼ Falling" : "— Stable"}</span>
                    <button
                      onClick={() => handleDeployPatrol(z.id)}
                      className="mt-2 flex items-center gap-1 mx-auto px-2 py-1 bg-cpd-accent/10 text-cpd-accent rounded text-[10px] font-bold hover:bg-cpd-accent/20 transition-colors"
                    >
                      <Radio className="w-3 h-3" />
                      Deploy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
