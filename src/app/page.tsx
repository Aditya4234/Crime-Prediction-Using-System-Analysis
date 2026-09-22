"use client";

import Shell from "@/components/Shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import PredictiveCharts from "@/components/PredictiveCharts";
import GISMap from "@/components/GISMap";
import TriageDrawer from "@/components/TriageDrawer";

export default function Home() {
  return (
    <ProtectedRoute>
      <Shell>
        <div className="flex h-full overflow-hidden flex-col lg:flex-row">
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto">
              <PredictiveCharts />
            </div>
            <div className="h-[200px] sm:h-[280px] border-t border-cpd-border p-2 sm:p-3 shrink-0">
              <GISMap />
            </div>
          </div>
          <div className="hidden xl:block">
            <TriageDrawer />
          </div>
        </div>
      </Shell>
    </ProtectedRoute>
  );
}
