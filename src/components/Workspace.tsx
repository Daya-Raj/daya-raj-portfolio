import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { skillIcons } from "@/lib/skill-icons";
import { SiteNav } from "@/components/SiteNav";
import { AppWindow, SideItem } from "@/components/AppWindow";
import { assets, projects, skills, type Skill } from "@/config/site";
import { cn } from "@/lib/utils";

type View = "projects" | "skills";

/** Shared workspace window: Projects (/work) and Skills (/skills) live inside the same app frame. */
export function Workspace({ view }: { view: View }) {
  const [active, setActive] = useState(0);
  const list = view === "projects" ? projects : skills;

  return (
    <div
      className="workspace-bg relative min-h-screen overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: assets.landscape ? `url(${assets.landscape})` : "var(--gradient-landscape)" }}
    >
      <SiteNav tone="glass" />
      <main className="relative px-4 pb-6 pt-2 md:px-10 md:pt-3">
        <AppWindow
          title={view === "projects" ? "Workspace — Projects" : "Workspace — Skills"}
          sidebar={
            <>
              <p className="eyebrow hidden px-3 pb-2 !text-[0.6rem] text-muted-foreground md:block">Navigation</p>
              <div className="mb-4 flex gap-2 md:flex-col">
                {(["projects", "skills"] as const).map((v) => (
                  <Link
                    key={v}
                    to={v === "projects" ? "/work" : "/skills"}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors",
                      v === view ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5",
                    )}
                    aria-current={v === view ? "page" : undefined}
                  >
                    {v}
                  </Link>
                ))}
              </div>
              <p className="eyebrow hidden px-3 pb-2 !text-[0.6rem] text-muted-foreground md:block">
                {view === "projects" ? "Projects" : "Categories"}
              </p>
              <div className="flex gap-2 overflow-x-auto md:flex-col">
                {list.map((it, i) => (
                  <SideItem key={it.id} index={i} label={it.name} active={i === active} onClick={() => setActive(i)} />
                ))}
              </div>
            </>
          }
        >
                      <motion.div
              key={`${view}-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
               className="h-full min-h-0"
            >
              {view === "projects" ? <ProjectPanel index={active} /> : <SkillsPanel index={active} />}
            </motion.div>
        </AppWindow>
      </main>
    </div>
  );
}

function ProjectPanel({ index }: { index: number }) {
  const p = projects[index];
  if (!p) return null;
  return (
    <article className="flex h-full min-h-0 flex-col">
      <p className="eyebrow !text-[0.6rem] text-accent">{p.tag}</p>
       <h1 className="mt-1 shrink-0 font-serif text-3xl md:text-4xl">{p.name}</h1>
       <p className="mt-2 shrink-0 text-sm text-muted-foreground">{p.description}</p>
       <div className="project-preview mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-foreground/10 bg-card/60 p-2">
         <img src={p.image} alt={`${p.name} preview`} className="h-full w-full object-contain" />
      </div>
      {p.url && (
        <div className="mt-4 flex justify-end">
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 !text-[0.6rem] text-primary-foreground hover:bg-accent">
            View Project <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}

function SkillGrid({ items }: { items: Skill[] }) {
  const stacked = items.length < 5;
  return (
    <ul className={cn("grid gap-3", stacked ? "grid-cols-1" : "grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3")}>
      {items.map((s) => (
        <li key={s.name} className={cn("flex items-center gap-3 rounded-xl border border-foreground/10 bg-card/60 px-4 transition-colors hover:border-foreground/30", stacked ? "py-4" : "py-3.5")}>
          <SkillMark skill={s} />
          <span className={cn("font-medium leading-snug", stacked ? "text-base" : "text-sm")}>{s.name}</span>
        </li>
      ))}
    </ul>
  );
}

function SkillsPanel({ index }: { index: number }) {
  const c = skills[index];
  if (!c) return null;
  return (
    <div>
      <p className="eyebrow !text-[0.6rem] text-accent">
        {String(index + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
      </p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{c.name === "DSA" ? "Data Structures & Algorithms" : c.name}</h1>
      <div className="mt-8">
        <SkillGrid items={c.items} />
      </div>
      {c.platforms && (
        <>
          <p className="eyebrow mb-3 mt-8 !text-[0.6rem] text-muted-foreground">Practice platforms</p>
          <SkillGrid items={c.platforms} />
        </>
      )}
    </div>
  );
}

function SkillMark({ skill }: { skill: Skill }) {
  const icon = skill.icon ? (skillIcons[skill.icon] ?? null) : null;
  if (!icon) {
    return (
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-[0.65rem] font-semibold text-muted-foreground">
        {skill.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
      <svg role="img" aria-label={`${icon.title} logo`} viewBox="0 0 24 24" className="h-5 w-5" fill={`#${icon.hex}`}>
        <path d={icon.path} />
      </svg>
    </span>
  );
}
