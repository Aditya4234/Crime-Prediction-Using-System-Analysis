"use client";

import { ReactNode, useSyncExternalStore, createContext, useContext, useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import StatusBar from "@/components/StatusBar";
import CommandPalette from "@/components/CommandPalette";

const emptySubscribe = () => () => {};

interface ShellContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

export const ShellContext = createContext<ShellContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function useShell() {
  return useContext(ShellContext);
}

export default function Shell({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  return (
    <ShellContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      <CommandPalette />
      <div className="flex flex-col h-screen bg-cpd-bg-primary noise relative">
        <StatusBar />
        <div className="flex flex-1 overflow-hidden relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-50 lg:z-auto h-[calc(100vh-2.5rem)] transition-transform duration-300 ease-out`}>
            <AppSidebar />
          </div>
          <main className="flex-1 overflow-hidden min-w-0">
            {mounted ? (
              <div className="animate-fade-in h-full">
                {children}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-cpd-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-cpd-text-dim font-medium">Loading...</span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
