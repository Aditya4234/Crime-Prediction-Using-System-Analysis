"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { Map, Layers, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

const mapLayers = [
  { name: "Crime Heatmap", active: true, color: "bg-cpd-danger" },
  { name: "Patrol Units", active: true, color: "bg-cpd-accent" },
  { name: "Traffic Cams", active: false, color: "bg-cpd-warning" },
  { name: "ALPR Readers", active: false, color: "bg-cpd-success" },
  { name: "Predicted Hotspots", active: true, color: "bg-purple-500" },
];

const zones = [
  { id: "A7", name: "Downtown Core", risk: 94, units: 8, incidents: 12 },
  { id: "C3", name: "Transit Hub", risk: 87, units: 5, incidents: 8 },
  { id: "B12", name: "Market District", risk: 82, units: 6, incidents: 7 },
  { id: "D5", name: "Industrial Park", risk: 76, units: 3, incidents: 4 },
  { id: "E9", name: "University Area", risk: 71, units: 4, incidents: 5 },
  { id: "F2", name: "Residential North", risk: 65, units: 2, incidents: 3 },
];

export default function GISMapPage() {
  const { toast } = useToast();
  const [layers, setLayers] = useState(mapLayers);

  const toggleLayer = (index: number) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, active: !l.active } : l))
    );
    toast(`Layer "${layers[index].name}" ${layers[index].active ? "hidden" : "shown"}`, "info");
  };

  const handleExport = () => {
    toast("Map exported as high-res PNG", "success");
  };

  return (
    <Shell>
      <PageLayout
        title="GIS TACTICAL MAP"
        subtitle="Live geographic intelligence and patrol tracking"
        icon={Map}
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text hover:border-cpd-accent transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        }
      >
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          <div className="flex-1 bg-cpd-bg-secondary border border-cpd-border rounded relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 text-cpd-accent/20 mx-auto mb-3" />
                <p className="text-sm text-cpd-text-dim">Interactive GIS Map</p>
                <p className="text-xs text-cpd-text-dim/60">42 active units</p>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-cpd-bg-secondary/90 border border-cpd-border rounded p-2">
              <p className="text-[9px] text-cpd-text-dim">
                <span className="text-cpd-accent font-mono">42</span> units |{" "}
                <span className="text-cpd-warning font-mono">3</span> responding
              </p>
            </div>
          </div>

          <div className="w-full lg:w-72 space-y-3 shrink-0">
            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">MAP LAYERS</span>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {layers.map((layer, i) => (
                  <label key={layer.name} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-cpd-bg-primary transition-colors">
                    <input type="checkbox" checked={layer.active} onChange={() => toggleLayer(i)} className="sr-only peer" />
                    <div className="w-3 h-3 rounded border border-cpd-border peer-checked:border-cpd-accent peer-checked:bg-cpd-accent/20 flex items-center justify-center">
                      {layer.active && <div className="w-1.5 h-1.5 rounded bg-cpd-accent" />}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${layer.color}`} />
                    <span className="text-xs text-cpd-text">{layer.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3">
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-4 h-4 text-cpd-warning" />
                <span className="text-xs font-bold text-cpd-text">ZONE OVERVIEW</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {zones.map((z) => (
                  <div key={z.id} className="bg-cpd-bg-primary rounded p-2 border border-cpd-border hover:border-cpd-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cpd-text">ZONE-{z.id}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${z.risk >= 85 ? "bg-cpd-danger/20 text-cpd-danger" : z.risk >= 70 ? "bg-cpd-warning/20 text-cpd-warning" : "bg-cpd-success/20 text-cpd-success"}`}>{z.risk}%</span>
                    </div>
                    <p className="text-[10px] text-cpd-text-dim mt-0.5">{z.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-cpd-text-dim">
                      <span>{z.units} units</span>
                      <span>{z.incidents} incidents</span>
                    </div>
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
