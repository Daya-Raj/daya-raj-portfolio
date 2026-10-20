import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Shared floating desktop-application window used by Work and Skills. */
export function AppWindow({ title, sidebar, children }: { title: string; sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="workspace-window relative z-10 mx-auto flex w-full max-w-[1400px] flex-col overflow-hidden rounded-[22px] border border-glass-border bg-window animate-rise">
      <div className="flex shrink-0 items-center gap-2 border-b border-foreground/10 px-4 py-3">
        <span aria-hidden className="h-3 w-3 rounded-full bg-accent" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-muted-foreground/40" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-muted-foreground/40" />
        <p className="eyebrow flex-1 text-center !text-[0.6rem] text-muted-foreground">{title}</p>
        <span className="w-12" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside className="min-h-0 min-w-0 overflow-auto border-b border-foreground/10 bg-window-side p-3 md:border-b-0 md:border-r md:p-4">{sidebar}</aside>
        <section className="min-h-0 min-w-0 overflow-auto bg-glass-content p-4 md:px-7 md:py-5">{children}</section>
      </div>
    </div>
  );
}

export function SideItem({ active, onClick, index, label }: { active: boolean; onClick: () => void; index: number; label: string }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-auto shrink-0 items-center justify-start whitespace-nowrap md:w-full gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
      }`}
    >
      <span className={`font-mono text-[0.65rem] ${active ? "text-accent" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
      <span className="font-medium">{label}</span>
    </Button>
  );
}
