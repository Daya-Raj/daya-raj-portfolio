import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Award } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { leetcodeBadges, socials } from "@/config/site";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Daya Raj" },
      { name: "description", content: "Academic results, hackathon participation and LeetCode milestones of Daya Raj." },
      { property: "og:title", content: "Achievements — Daya Raj" },
      { property: "og:description", content: "Academics, hackathons and LeetCode milestones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Achievements,
});

const academics = [
  { value: "9.23", label: "CGPA", sub: "VIT-AP University" },
  { value: "96%", label: "Intermediate", sub: "Class XII" },
  { value: "95%", label: "10th Grade", sub: "Class X" },
];

function Achievements() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-12">
        <p className="eyebrow text-muted-foreground">[ 04 ]</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">Achievements</h1>

        <section aria-labelledby="acad" className="mt-14">
          <h2 id="acad" className="eyebrow mb-5">Academic results</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {academics.map((a) => (
              <div key={a.label} className="rounded-2xl border bg-card p-6">
                <p className="font-serif text-5xl">{a.value}</p>
                <p className="mt-3 font-semibold">{a.label}</p>
                <p className="text-sm text-muted-foreground">{a.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="hack" className="mt-14">
          <h2 id="hack" className="eyebrow mb-5">Hackathon</h2>
          <div className="rounded-2xl bg-charcoal p-8 text-on-dark">
            <p className="eyebrow !text-[0.6rem] text-accent">Idea submission</p>
            <p className="mt-3 font-serif text-3xl">Yuva Yodha Energy Tech Hackathon 2026</p>
            <p className="mt-3 text-on-dark-muted">Challenge 03 — Grid Reliability: Renewable Intermittency. Submitted the GridPilot idea.</p>
          </div>
        </section>

        <section aria-labelledby="lc" className="mt-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="lc" className="eyebrow">LeetCode milestones</h2>
            <a href={socials.leetcode} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex items-center gap-1 !text-[0.62rem] hover:text-accent">
              View profile <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mb-4 flex items-baseline gap-4 rounded-2xl border bg-card p-6">
            <p className="font-serif text-5xl">200+</p>
            <p className="font-semibold">LeetCode problems solved</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {leetcodeBadges.map((b) => (
              <div key={b.name} className="flex items-center gap-4 rounded-2xl border bg-card p-6">
                {b.image ? (
                  <img src={b.image} alt={b.name} className="h-14 w-14 object-contain" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><Award className="h-6 w-6" /></span>
                )}
                <p className="font-semibold">{b.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
