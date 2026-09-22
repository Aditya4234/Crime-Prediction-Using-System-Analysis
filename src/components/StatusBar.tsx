"use client";

import { useState, useEffect, useRef } from "react";
import {
  Wifi,
  Database,
  Clock,
  ChevronDown,
  Bell,
  Shield,
  Activity,
  Zap,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useShell } from "@/components/Shell";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const jurisdictions = [
  "Central Division - Sector 7",
  "North Division - Sector 3",
  "South Division - Sector 12",
  "East Division - Sector 9",
  "West Division - Sector 5",
];

export default function StatusBar() {
  const [time, setTime] = useState<Date | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alerts, setAlerts] = useState(3);
  const initialized = useRef(false);
  const { toggleSidebar } = useShell();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTime(new Date());
    }
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts");
        const data = await res.json();
        setAlerts(data.count);
      } catch {}
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between h-10 px-2 sm:px-4 bg-cpd-bg-secondary/70 backdrop-blur-xl border-b border-cpd-border-subtle text-xs relative z-30">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button onClick={toggleSidebar} className="p-1 lg:hidden text-cpd-text-dim hover:text-cpd-accent transition-colors shrink-0 rounded-md hover:bg-cpd-bg-primary">
          <Menu className="w-4.5 h-4.5" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <Shield className="w-4 h-4 text-cpd-accent shrink-0 hidden sm:block" />
          <span className="font-bold text-cpd-accent tracking-[0.2em] text-[11px] hidden sm:inline">CPAS</span>
          <span className="text-cpd-border hidden md:inline">|</span>
          <span className="text-cpd-text-muted font-medium text-[11px] hidden lg:inline tracking-wide">CRIME PREDICTION & ANALYSIS SYSTEM</span>
        </div>

        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cpd-bg-primary/50 hover:bg-cpd-bg-primary text-cpd-text transition-all border border-cpd-border-subtle hover:border-cpd-border"
          >
            <span className="text-cpd-accent text-[10px] sm:text-[11px] truncate max-w-[140px] font-medium">{jurisdictions[selectedJurisdiction]}</span>
            <ChevronDown className={`w-3 h-3 text-cpd-text-muted transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute top-full left-0 mt-2 w-64 glass-strong rounded-xl shadow-2xl shadow-black/30 z-50 overflow-hidden animate-fade-in-down">
                <div className="p-1.5">
                  {jurisdictions.map((j, i) => (
                    <button
                      key={j}
                      onClick={() => { setSelectedJurisdiction(i); setShowDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[11px] transition-colors ${
                        i === selectedJurisdiction
                          ? "text-cpd-accent bg-cpd-accent/10"
                          : "text-cpd-text hover:bg-cpd-bg-primary hover:text-cpd-text"
                      }`}
                    >{j}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <StatusIndicator icon={Wifi} label="MESH" color="success" hidden="md" />
        <StatusIndicator icon={Database} label="DB" color="accent" hidden="md" />
        <StatusIndicator icon={Zap} label="AI" color="warning" hidden="lg" />
        <StatusIndicator icon={Activity} label="42 UNITS" color="dim" hidden="lg" />

        <Link href="/active-alerts" className="relative p-1.5 rounded-lg hover:bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-warning transition-all">
          <Bell className="w-4 h-4" />
          {alerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cpd-danger text-white text-[8px] rounded-full flex items-center justify-center font-bold animate-pulse-glow shadow-lg shadow-cpd-danger/30">
              {alerts}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-1.5 text-cpd-text pl-1 border-l border-cpd-border-subtle">
          <Clock className="w-3 h-3 text-cpd-accent shrink-0" />
          <span className="font-mono font-medium text-[10px] sm:text-[11px] tabular-nums">
            {time ? time.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"}
          </span>
          <span className="text-cpd-text-muted text-[10px] hidden sm:inline">
            {time ? time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}
          </span>
        </div>

        {/* User Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-cpd-bg-primary text-cpd-text-dim hover:text-cpd-text transition-all border-l border-cpd-border-subtle pl-2"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-[10px] font-medium hidden sm:inline">{user.fullName}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
            </button>
            
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl shadow-black/30 z-50 overflow-hidden animate-fade-in-down">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-cpd-border-subtle mb-1">
                      <p className="text-xs font-medium text-cpd-text">{user.fullName}</p>
                      <p className="text-[10px] text-cpd-text-muted">{user.badge} • {user.role}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function StatusIndicator({
  icon: Icon,
  label,
  color,
  hidden,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: "success" | "accent" | "warning" | "dim";
  hidden: "sm" | "md" | "lg";
}) {
  const colors = {
    success: "text-cpd-success",
    accent: "text-cpd-accent",
    warning: "text-cpd-warning",
    dim: "text-cpd-text-dim",
  };

  return (
    <div className={`hidden ${hidden}:flex items-center gap-1.5 ${colors[color]} px-1.5 py-1 rounded-md hover:bg-cpd-bg-primary/50 transition-colors`}>
      <Icon className="w-3 h-3" />
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
