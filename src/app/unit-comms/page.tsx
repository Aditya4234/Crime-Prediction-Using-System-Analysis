"use client";

import Shell from "@/components/Shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import { Radio, Send, Users, Circle, CircleDot, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";

interface Unit {
  id: string;
  officer: string;
  status: string;
  zone: string;
  battery: number;
  signal: string;
}

interface Message {
  id: number;
  from: string;
  msg: string;
  time: string;
  priority: string;
}

export default function UnitCommsPage() {
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUnitsAndMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUnitsAndMessages = async () => {
    try {
      const [unitsRes, messagesRes] = await Promise.all([
        api.get<{ units: Unit[] }>("/units"),
        api.get<Message[]>("/units/messages"),
      ]);

      if (unitsRes.success && unitsRes.data) {
        setUnits(unitsRes.data.units || []);
      }

      if (messagesRes.success && messagesRes.data) {
        setMessages(Array.isArray(messagesRes.data) ? messagesRes.data : []);
      }
    } catch (error) {
      toast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!msgInput.trim()) return;

    try {
      const response = await api.post<Message>("/units/messages", {
        from: "DISPATCH",
        msg: msgInput.trim(),
        priority: "normal",
      });

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data!]);
      }
      setMsgInput("");
      toast("Message broadcast to all units", "success");
    } catch (error) {
      toast("Failed to send message", "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleHailUnit = (unitId: string) => {
    setSelectedUnit(unitId);
    toast(`Direct channel opened with ${unitId}`, "info");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Shell>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-cpd-accent animate-spin" />
          </div>
        </Shell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Shell>
        <PageLayout
          title="UNIT COMMUNICATIONS"
          subtitle="Real-time patrol unit radio and messaging"
          icon={Radio}
        >
          <div className="flex gap-4 h-full">
            <div className="w-72 bg-cpd-bg-secondary border border-cpd-border rounded p-3 overflow-y-auto shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">ACTIVE UNITS</span>
              </div>
              <div className="space-y-2">
                {units.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleHailUnit(u.id)}
                    className={`w-full text-left bg-cpd-bg-primary rounded p-2 border transition-colors ${
                      selectedUnit === u.id ? "border-cpd-accent" : "border-cpd-border hover:border-cpd-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cpd-text">{u.id}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        u.status === "responding" ? "bg-cpd-danger/20 text-cpd-danger" :
                        u.status === "staging" ? "bg-cpd-warning/20 text-cpd-warning" :
                        u.status === "patrol" ? "bg-cpd-accent/20 text-cpd-accent" :
                        "bg-cpd-success/20 text-cpd-success"
                      }`}>{u.status.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] text-cpd-text-dim mt-0.5">{u.officer}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-cpd-text-dim">Zone {u.zone}</span>
                      <span className="text-[9px] text-cpd-text-dim">{u.battery}%</span>
                      <CircleDot className={`w-2 h-2 ${
                        u.signal === "strong" ? "text-cpd-success" :
                        u.signal === "medium" ? "text-cpd-warning" : "text-cpd-danger"
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-cpd-bg-secondary border border-cpd-border rounded overflow-hidden min-w-0">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-cpd-border">
                <Radio className="w-4 h-4 text-cpd-accent" />
                <span className="text-xs font-bold text-cpd-text">
                  {selectedUnit ? `DIRECT — ${selectedUnit}` : "LIVE CHANNEL"}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-cpd-success text-cpd-success animate-pulse-glow" />
                  <span className="text-[10px] text-cpd-success">CONNECTED</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.from === "DISPATCH" ? "bg-cpd-danger/5 -mx-4 px-4 py-2 border-y border-cpd-danger/20" : ""}`}>
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                      m.from === "DISPATCH" ? "bg-cpd-danger/20" : "bg-cpd-accent/20"
                    }`}>
                      <Radio className={`w-4 h-4 ${m.from === "DISPATCH" ? "text-cpd-danger" : "text-cpd-accent"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${m.from === "DISPATCH" ? "text-cpd-danger" : "text-cpd-accent"}`}>{m.from}</span>
                        <span className="text-[10px] text-cpd-text-dim">{m.time}</span>
                        {m.priority === "critical" && <span className="text-[9px] px-1 py-0.5 bg-cpd-danger/20 text-cpd-danger rounded font-bold">URGENT</span>}
                      </div>
                      <p className="text-xs text-cpd-text mt-0.5">{m.msg}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-cpd-border">
                <div className="flex gap-2">
                  <input
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedUnit ? `Message ${selectedUnit}...` : "Type broadcast message..."}
                    className="flex-1 bg-cpd-bg-primary border border-cpd-border rounded px-3 py-2 text-xs text-cpd-text placeholder:text-cpd-text-dim focus:outline-none focus:border-cpd-accent"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!msgInput.trim()}
                    className="px-4 py-2 bg-cpd-accent text-cpd-bg-primary rounded text-xs font-bold hover:bg-cpd-accent/80 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    SEND
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PageLayout>
      </Shell>
    </ProtectedRoute>
  );
}
