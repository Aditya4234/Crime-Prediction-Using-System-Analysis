"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-cpd-bg-primary">
      <div className="glass-strong rounded-2xl p-8 max-w-md text-center space-y-5 animate-scale-in border border-cpd-danger/20">
        <div className="w-16 h-16 rounded-2xl bg-cpd-danger/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-9 h-9 text-cpd-danger" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-cpd-text">SYSTEM ERROR</h2>
          <p className="text-sm text-cpd-text-dim mt-1">{error.message}</p>
        </div>
        <button
          onClick={reset}
          className="btn btn-primary gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Restart System
        </button>
      </div>
    </div>
  );
}
