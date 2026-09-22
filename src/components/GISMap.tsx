"use client";

import { useState } from "react";
import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2, Satellite } from "lucide-react";

const hotspots = [
  { name: "Downtown Core", risk: 94, x: 45, y: 35 },
  { name: "Transit Hub", risk: 87, x: 60, y: 50 },
  { name: "Market District", risk: 82, x: 30, y: 60 },
];

const incidentMarkers = [
  { type: "robbery", x: 42, y: 38, severity: "high" },
  { type: "assault", x: 55, y: 45, severity: "medium" },
  { type: "burglary", x: 35, y: 55, severity: "low" },
];

export default function GISMap() {
  const [activeLayer, setActiveLayer] = useState("all");

  return (
    <div className="flex flex-col h-full bg-cpd-bg-secondary/50 backdrop-blur-sm border border-cpd-border-subtle rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cpd-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cpd-accent/10 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-cpd-accent" />
          </div>
          <span className="text-[11px] font-semibold text-cpd-text tracking-wide">LIVE GIS MAP</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[Layers, ZoomIn, ZoomOut, Maximize2].map((Icon, i) => (
            <button key={i} className="p-1.5 rounded-md hover:bg-cpd-bg-primary text-cpd-text-muted hover:text-cpd-accent transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 bg-cpd-bg-primary grid-bg overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="hotspotGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>
          {hotspots.map((h) => (
            <g key={h.name}>
              <circle cx={`${h.x}%`} cy={`${h.y}%`} r="40" fill="url(#hotspotGrad)" className="animate-pulse-glow" />
              <circle cx={`${h.x}%`} cy={`${h.y}%`} r="5" fill="#EF4444" stroke="#EF444460" strokeWidth="2" />
            </g>
          ))}
          {incidentMarkers.map((inc, i) => (
            <g key={i}>
              <circle cx={`${inc.x}%`} cy={`${inc.y}%`} r="4" fill={inc.severity === "high" ? "#EF4444" : inc.severity === "medium" ? "#F59E0B" : "#10B981"} />
              <circle cx={`${inc.x}%`} cy={`${inc.y}%`} r="10" fill="none" stroke={inc.severity === "high" ? "#EF444430" : inc.severity === "medium" ? "#F59E0B30" : "#10B98130"} strokeWidth="1" className="animate-pulse-glow" />
            </g>
          ))}
        </svg>

        <div className="absolute top-2 left-2 glass-strong rounded-lg p-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Satellite className="w-3 h-3 text-cpd-accent" />
            <span className="text-[9px] font-semibold text-cpd-text tracking-wide">LIVE FEED</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cpd-accent" /><span className="text-[9px] text-cpd-text-dim">Patrol Unit</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cpd-warning" /><span className="text-[9px] text-cpd-text-dim">Responding</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cpd-danger" /><span className="text-[9px] text-cpd-text-dim">Staging</span></div>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 glass-strong rounded-lg p-2">
          <p className="text-[9px] text-cpd-text-dim"><span className="text-cpd-accent font-mono font-bold">42</span> units</p>
          <p className="text-[9px] text-cpd-text-dim"><span className="text-cpd-warning font-mono font-bold">3</span> responding</p>
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 glass-strong rounded-lg p-1">
          {["all", "patrol", "incidents", "hotspots"].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2 py-1 rounded-md text-[9px] font-semibold transition-all ${
                activeLayer === layer
                  ? "bg-cpd-accent text-cpd-bg-primary shadow-lg shadow-cpd-accent/20"
                  : "text-cpd-text-dim hover:text-cpd-text hover:bg-cpd-bg-primary/50"
              }`}
            >{layer.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
