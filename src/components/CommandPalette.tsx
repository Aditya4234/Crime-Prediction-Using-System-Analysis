"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Brain,
  AlertTriangle,
  Radio,
  Shield,
  Users,
  TrendingUp,
  FileText,
  Activity,
  Crosshair,
  Settings,
  Command,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  shortcut?: string;
  category: string;
}

const commands: CommandItem[] = [
  { id: "home", label: "Command Center", icon: LayoutDashboard, href: "/", shortcut: "1", category: "Navigation" },
  { id: "map", label: "GIS Tactical Map", icon: Map, href: "/gis-map", shortcut: "2", category: "Navigation" },
  { id: "analytics", label: "Predictive Analytics", icon: Brain, href: "/predictive-analytics", shortcut: "3", category: "Navigation" },
  { id: "alerts", label: "Active Alerts", icon: AlertTriangle, href: "/active-alerts", shortcut: "4", category: "Navigation" },
  { id: "comms", label: "Unit Communications", icon: Radio, href: "/unit-comms", shortcut: "5", category: "Navigation" },
  { id: "incidents", label: "Incidents", icon: Shield, href: "/incidents", shortcut: "6", category: "Navigation" },
  { id: "personnel", label: "Personnel", icon: Users, href: "/personnel", shortcut: "7", category: "Navigation" },
  { id: "trends", label: "Trend Analysis", icon: TrendingUp, href: "/trend-analysis", shortcut: "8", category: "Navigation" },
  { id: "reports", label: "Reports & SitReps", icon: FileText, href: "/reports", shortcut: "9", category: "Navigation" },
  { id: "health", label: "System Health", icon: Activity, href: "/system-health", shortcut: "0", category: "Navigation" },
  { id: "zones", label: "Target Zones", icon: Crosshair, href: "/target-zones", category: "Navigation" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", category: "Navigation" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevQueryRef = useRef(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = useCallback((cmd: CommandItem) => {
    router.push(cmd.href);
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[selectedIndex] as HTMLElement;
    if (item) item.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value !== prevQueryRef.current) {
      prevQueryRef.current = value;
      setSelectedIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      executeCommand(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => { setOpen(false); setQuery(""); }}
      />
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="glass-strong rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-cpd-border-subtle">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-cpd-border-subtle">
            <Command className="w-4 h-4 text-cpd-accent shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands, pages, actions..."
              className="flex-1 bg-transparent text-sm text-cpd-text placeholder:text-cpd-text-muted focus:outline-none"
            />
            <kbd className="text-[10px] text-cpd-text-muted bg-cpd-bg-primary px-1.5 py-0.5 rounded border border-cpd-border font-mono">
              ESC
            </kbd>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-cpd-text-dim">No results found</p>
                <p className="text-xs text-cpd-text-muted mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                <p className="px-4 py-1.5 text-[10px] font-semibold text-cpd-text-muted uppercase tracking-wider">
                  Pages
                </p>
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === selectedIndex
                          ? "bg-cpd-accent/10 text-cpd-accent"
                          : "text-cpd-text hover:bg-cpd-bg-primary"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${i === selectedIndex ? "text-cpd-accent" : "text-cpd-text-dim"}`} />
                      <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="text-[10px] text-cpd-text-muted bg-cpd-bg-primary px-1.5 py-0.5 rounded border border-cpd-border font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      <ArrowRight className={`w-3 h-3 transition-opacity ${i === selectedIndex ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  );
                })}
              </>
            )}
          </div>

          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-cpd-border-subtle text-[10px] text-cpd-text-muted">
            <span className="flex items-center gap-1">
              <kbd className="bg-cpd-bg-primary px-1 py-0.5 rounded border border-cpd-border font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-cpd-bg-primary px-1 py-0.5 rounded border border-cpd-border font-mono">↵</kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-cpd-bg-primary px-1 py-0.5 rounded border border-cpd-border font-mono">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
