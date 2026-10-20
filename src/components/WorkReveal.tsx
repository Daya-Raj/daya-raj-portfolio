import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export type RevealTarget = "/work" | "/about";
type Ctx = { openWork: (x: number, y: number) => void; openRoute: (to: RevealTarget, x: number, y: number) => void };
const RevealCtx = createContext<Ctx>({ openWork: () => {}, openRoute: () => {} });
export const useWorkReveal = () => useContext(RevealCtx);

const COVER_MS = 520;
const FADE_MS = 420;
const FAILSAFE_MS = 2500;

/**
 * Black circular reveal played ONLY on explicit clicks (Work, and the About nav item).
 * Animated with the Web Animations API so completion is driven by real
 * animation events (not chained timers), and a failsafe always removes the
 * overlay so it can never stay covering the page.
 */
export function WorkRevealProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState<{ x: number; y: number; to: RevealTarget } | null>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const failsafe = useRef<number | undefined>(undefined);

  const finish = useCallback(() => {
    window.clearTimeout(failsafe.current);
    setActive(null);
  }, []);

  const openRoute = useCallback(
    (to: RevealTarget, x: number, y: number) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || active) {
        navigate({ to });
        return;
      }
      setActive({ x, y, to });
      failsafe.current = window.setTimeout(finish, FAILSAFE_MS);
    },
    [active, navigate, finish],
  );
  const openWork = useCallback((x: number, y: number) => openRoute("/work", x, y), [openRoute]);

  // Run the sequence once the overlay element is mounted.
  useEffect(() => {
    const el = overlay.current;
    if (!active || !el) return;
    let cancelled = false;
    const r = Math.hypot(Math.max(active.x, innerWidth - active.x), Math.max(active.y, innerHeight - active.y));
    const cover = el.animate(
      [
        { clipPath: `circle(0px at ${active.x}px ${active.y}px)` },
        { clipPath: `circle(${r}px at ${active.x}px ${active.y}px)` },
      ],
      { duration: active.to === "/about" ? 380 : COVER_MS, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" },
    );
    cover.finished
      .then(() => (cancelled ? undefined : navigate({ to: active.to })))
      .then(() => {
        if (cancelled) return;
        const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: active.to === "/about" ? 320 : FADE_MS, easing: "ease", fill: "forwards" });
        return fade.finished;
      })
      .catch(() => {})
      .finally(() => !cancelled && finish());
    return () => {
      cancelled = true;
      cover.cancel();
    };
  }, [active, navigate, finish]);

  // Once the route changes to anything other than the target (e.g. back/forward), drop the overlay.
  useEffect(() => {
    if (active && path !== active.to) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <RevealCtx.Provider value={{ openWork, openRoute }}>
      {children}
      {active && (
        <div
          ref={overlay}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100] bg-charcoal"
          style={{ clipPath: `circle(0px at ${active.x}px ${active.y}px)` }}
        />
      )}
    </RevealCtx.Provider>
  );
}
