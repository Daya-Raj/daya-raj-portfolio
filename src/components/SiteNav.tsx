import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { assets } from "@/config/site";
import { useWorkReveal } from "./WorkReveal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/achievements", label: "Achievements" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav({ tone = "light" }: { tone?: "light" | "dark" | "glass" }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { openRoute } = useWorkReveal();
  const [open, setOpen] = useState(false);
  const dark = tone === "dark" || tone === "glass";

  return (
    <header
      className={cn(
        "relative z-40 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 md:px-12",
        dark ? "text-on-dark" : "text-foreground",
        tone === "glass" && "nav-glass-text",
      )}
    >
      <Link to="/" aria-label="Daya Raj — home" className="flex items-center">
        {assets.logo ? (
          <img src={assets.logo} alt="DR monogram" className={cn("h-9 w-auto md:h-12", dark && "invert")} />
        ) : (
          <span className="font-serif text-3xl leading-none tracking-tight">DR</span>
        )}
      </Link>

      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {items.map((it) => {
            const active = it.to === "/" ? path === "/" : it.to === "/work" ? path === "/work" || path === "/skills" : path.startsWith(it.to);
            return (
              <li key={it.to} className="relative">
                <Link
                  to={it.to}
                  onClick={(e) => {
                    if ((it.to === "/work" || it.to === "/about") && path !== it.to) {
                      e.preventDefault();
                      openRoute(it.to, e.clientX, e.clientY);
                    }
                  }}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "eyebrow !text-[0.68rem] !tracking-[0.24em] transition-opacity",
                     tone === "glass" ? "!font-bold opacity-100" : active ? "opacity-100" : "opacity-60 hover:opacity-100",
                  )}
                >
                  {it.label}
                </Link>
                {active && <span className="absolute -bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent" />}
              </li>
            );
          })}
        </ul>
      </nav>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <nav aria-label="Mobile" className="absolute left-4 right-4 top-full rounded-xl border bg-card p-4 text-foreground shadow-xl md:hidden">
          <ul className="flex flex-col">
            {items.map((it) => (
              <li key={it.to}>
                <Link
                  to={it.to}
                  onClick={(e) => {
                    setOpen(false);
                    if ((it.to === "/work" || it.to === "/about") && path !== it.to) {
                      e.preventDefault();
                      openRoute(it.to, e.clientX, e.clientY);
                    }
                  }}
                  className="eyebrow block py-3"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
