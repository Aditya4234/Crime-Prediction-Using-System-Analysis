"use client";

import { Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-cpd-bg-primary">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cpd-accent/20 to-cpd-accent/5 flex items-center justify-center border border-cpd-accent/20 animate-float">
          <Shield className="w-8 h-8 text-cpd-accent" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 border-2 border-cpd-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] text-cpd-text-dim font-medium tracking-wide">INITIALIZING SYSTEM...</span>
        </div>
      </div>
    </div>
  );
}
