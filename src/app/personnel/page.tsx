"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { Users, Search, Star } from "lucide-react";
import { useState } from "react";

const personnel = [
  { id: "P-1042", name: "Sgt. Williams", rank: "Sergeant", badge: "SWAT-A", shift: "Day", status: "on-duty", assignments: 12, rating: 4.8 },
  { id: "P-1078", name: "Ofc. Martinez", rank: "Officer", badge: "UNIT-14", shift: "Day", status: "on-duty", assignments: 8, rating: 4.6 },
  { id: "P-1085", name: "Ofc. Johnson", rank: "Officer", badge: "UNIT-22", shift: "Day", status: "responding", assignments: 15, rating: 4.9 },
  { id: "P-1091", name: "Ofc. Patel", rank: "Officer", badge: "UNIT-07", shift: "Day", status: "on-duty", assignments: 6, rating: 4.5 },
  { id: "P-1098", name: "Ofc. Chen", rank: "Officer", badge: "UNIT-31", shift: "Swing", status: "off-duty", assignments: 10, rating: 4.7 },
  { id: "P-1102", name: "Ofc. Garcia", rank: "Officer", badge: "UNIT-19", shift: "Day", status: "on-duty", assignments: 9, rating: 4.4 },
  { id: "P-1115", name: "Ofc. Thompson", rank: "Officer", badge: "UNIT-05", shift: "Day", status: "responding", assignments: 11, rating: 4.8 },
  { id: "P-1120", name: "Ofc. Lee", rank: "Officer", badge: "UNIT-28", shift: "Night", status: "off-duty", assignments: 7, rating: 4.3 },
];

export default function PersonnelPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = personnel.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.badge.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Shell>
      <PageLayout
        title="PERSONNEL"
        subtitle="Officer roster, duty status, and performance metrics"
        icon={Users}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cpd-text-dim" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search personnel..."
                className="pl-7 pr-3 py-1.5 bg-cpd-bg-primary border border-cpd-border rounded text-xs text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent w-48"
              />
            </div>
            {["all", "on-duty", "responding", "off-duty"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                  statusFilter === s ? "bg-cpd-accent text-cpd-bg-primary" : "bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-text"
                }`}
              >{s.toUpperCase()}</button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
            <p className="text-2xl font-bold font-mono text-cpd-accent">{personnel.length}</p>
            <p className="text-[10px] text-cpd-text-dim">TOTAL PERSONNEL</p>
          </div>
          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
            <p className="text-2xl font-bold font-mono text-cpd-success">{personnel.filter((p) => p.status === "on-duty").length}</p>
            <p className="text-[10px] text-cpd-text-dim">ON DUTY</p>
          </div>
          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
            <p className="text-2xl font-bold font-mono text-cpd-warning">{personnel.filter((p) => p.status === "responding").length}</p>
            <p className="text-[10px] text-cpd-text-dim">RESPONDING</p>
          </div>
          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-3 text-center">
            <p className="text-2xl font-bold font-mono text-cpd-text-dim">{personnel.filter((p) => p.status === "off-duty").length}</p>
            <p className="text-[10px] text-cpd-text-dim">OFF DUTY</p>
          </div>
        </div>

        <div className="bg-cpd-bg-secondary border border-cpd-border rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-cpd-border bg-cpd-bg-primary">
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">ID</th>
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">NAME</th>
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">RANK</th>
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">BADGE</th>
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">SHIFT</th>
                  <th className="text-left py-2.5 px-4 text-cpd-text-dim font-medium">STATUS</th>
                  <th className="text-center py-2.5 px-4 text-cpd-text-dim font-medium">ASSIGNMENTS</th>
                  <th className="text-center py-2.5 px-4 text-cpd-text-dim font-medium">RATING</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-cpd-border/50 hover:bg-cpd-bg-primary/50 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-cpd-accent">{p.id}</td>
                    <td className="py-2.5 px-4 text-cpd-text font-medium">{p.name}</td>
                    <td className="py-2.5 px-4 text-cpd-text-dim">{p.rank}</td>
                    <td className="py-2.5 px-4 font-mono text-cpd-text">{p.badge}</td>
                    <td className="py-2.5 px-4 text-cpd-text-dim">{p.shift}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        p.status === "on-duty" ? "bg-cpd-success/20 text-cpd-success" :
                        p.status === "responding" ? "bg-cpd-warning/20 text-cpd-warning" :
                        "bg-cpd-text-dim/20 text-cpd-text-dim"
                      }`}>{p.status.toUpperCase()}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-cpd-text">{p.assignments}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-cpd-warning">
                        <Star className="w-3 h-3 fill-cpd-warning" />
                        <span className="font-mono">{p.rating}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
