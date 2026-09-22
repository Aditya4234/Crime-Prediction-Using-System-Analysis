"use client";

import { ReactNode } from "react";

export default function PageLayout({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-5 py-3.5 border-b border-cpd-border-subtle bg-cpd-bg-secondary/40 backdrop-blur-sm gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cpd-accent/15 to-cpd-accent/5 flex items-center justify-center shrink-0 border border-cpd-accent/10">
            <Icon className="w-5 h-5 text-cpd-accent" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-cpd-text tracking-wide">{title}</h2>
            <p className="text-[10px] text-cpd-text-muted font-medium">{subtitle}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
    </div>
  );
}
