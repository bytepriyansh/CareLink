
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/10 dark:bg-slate-800/10 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15 dark:hover:bg-slate-800/15",
        className
      )}
    >
      {children}
    </div>
  );
}
