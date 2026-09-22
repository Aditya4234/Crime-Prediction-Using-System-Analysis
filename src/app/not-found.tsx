"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import Shell from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-cpd-danger/10 flex items-center justify-center mx-auto border border-cpd-danger/20 animate-float">
            <Shield className="w-10 h-10 text-cpd-danger" />
          </div>
          <div>
            <h1 className="text-5xl font-bold font-mono text-cpd-danger mb-2">404</h1>
            <h2 className="text-lg font-bold text-cpd-text">ACCESS DENIED</h2>
            <p className="text-sm text-cpd-text-dim mt-1">
              This sector is not authorized for your clearance level.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 btn btn-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Command Center
          </Link>
        </div>
      </div>
    </Shell>
  );
}
