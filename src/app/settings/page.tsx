"use client";

import Shell from "@/components/Shell";
import PageLayout from "@/components/PageLayout";
import { Settings, User, Bell, Shield, Monitor, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/Toast";

interface SettingToggle {
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SettingToggle[]>([
    { label: "Code-3 Critical Alerts", description: "Immediate notification for all Code-3 incidents", enabled: true },
    { label: "Unit Status Changes", description: "Notify when units go off-duty or need backup", enabled: true },
    { label: "AI Model Drift Alerts", description: "Alert when model performance degrades", enabled: true },
    { label: "Shift Handoff Reminders", description: "15-minute warning before shift changes", enabled: false },
    { label: "Daily Summary Email", description: "Automated daily SitRep to command staff", enabled: true },
  ]);
  const [twoFactor, setTwoFactor] = useState(true);
  const [displayName, setDisplayName] = useState("Cmdr. Aditya Sharma");
  const [badgeId, setBadgeId] = useState("CMD-001");
  const [email, setEmail] = useState("a.sharma@cpd.gov");
  const [role, setRole] = useState("Commander");
  const [mapLayer, setMapLayer] = useState("Crime Heatmap");
  const [refreshInterval, setRefreshInterval] = useState("5 seconds");
  const [timezone, setTimezone] = useState("Pacific Time (PT)");
  const [sessionTimeout, setSessionTimeout] = useState("15 minutes");

  const toggleNotification = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleSave = () => {
    toast("Settings saved successfully", "success");
  };

  const handleSignOut = () => {
    toast("All other sessions signed out", "info");
  };

  return (
    <Shell>
      <PageLayout
        title="SETTINGS"
        subtitle="System configuration and user preferences"
        icon={Settings}
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cpd-accent text-cpd-bg-primary rounded text-xs font-bold hover:bg-cpd-accent/80 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-cpd-accent" />
              <span className="text-xs font-bold text-cpd-text">USER PROFILE</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Display Name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent" />
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Badge ID</label>
                <input value={badgeId} onChange={(e) => setBadgeId(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent" />
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent" />
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent">
                  <option>Commander</option>
                  <option>Sergeant</option>
                  <option>Officer</option>
                  <option>Analyst</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-cpd-warning" />
              <span className="text-xs font-bold text-cpd-text">NOTIFICATION PREFERENCES</span>
            </div>
            <div className="space-y-3">
              {notifications.map((pref, i) => (
                <label key={pref.label} className="flex items-center justify-between p-2 bg-cpd-bg-primary rounded border border-cpd-border/50 cursor-pointer">
                  <div>
                    <p className="text-xs text-cpd-text font-medium">{pref.label}</p>
                    <p className="text-[10px] text-cpd-text-dim">{pref.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification(i)}
                    className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3 ${pref.enabled ? "bg-cpd-accent" : "bg-cpd-border"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pref.enabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-4 h-4 text-cpd-success" />
              <span className="text-xs font-bold text-cpd-text">DISPLAY PREFERENCES</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Map Default Layer</label>
                <select value={mapLayer} onChange={(e) => setMapLayer(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent">
                  <option>Crime Heatmap</option>
                  <option>Patrol Units</option>
                  <option>ALPR Readers</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Auto-Refresh Interval</label>
                <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent">
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>30 seconds</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent">
                  <option>Pacific Time (PT)</option>
                  <option>Eastern Time (ET)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-cpd-danger" />
              <span className="text-xs font-bold text-cpd-text">SECURITY</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Session Timeout</label>
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text focus:outline-none focus:border-cpd-accent">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-cpd-text-dim block mb-1">Two-Factor Authentication</label>
                <div className="flex items-center justify-between p-2 bg-cpd-bg-primary rounded border border-cpd-border/50">
                  <span className="text-xs text-cpd-text">{twoFactor ? "Enabled" : "Disabled"}</span>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${twoFactor ? "bg-cpd-accent" : "bg-cpd-border"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${twoFactor ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-2 bg-cpd-danger/10 text-cpd-danger border border-cpd-danger/30 rounded text-xs font-bold hover:bg-cpd-danger/20 transition-colors"
              >
                Sign Out All Sessions
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    </Shell>
  );
}
