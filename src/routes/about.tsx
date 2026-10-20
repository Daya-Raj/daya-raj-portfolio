import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { assets } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Daya Raj" },
      { name: "description", content: "Daya Raj builds thoughtful digital products across web development and AI/ML. Based in India." },
      { property: "og:title", content: "About — Daya Raj" },
      { property: "og:description", content: "Builder / developer based in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <SiteNav />
      <main className="relative mx-auto max-w-[1400px] px-6 pb-12 md:px-12">
        <p className="eyebrow absolute left-6 top-10 hidden text-muted-foreground md:left-12 md:block">[ 03 ]</p>
        <h1 className="mt-10 text-center font-display text-[clamp(4.5rem,17vw,16rem)] uppercase leading-[0.9] tracking-tight">Daya Raj</h1>

        <div className="relative mt-[-6vw] grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 md:order-1">
            <span className="block h-0.5 w-10 bg-accent" />
            <p className="eyebrow mt-6">Builder / Developer</p>
            <p className="mt-3 max-w-sm font-serif text-3xl leading-snug">Building thoughtful digital products across web development and AI/ML.</p>
          </div>

          <figure className="order-1 mx-auto w-[min(78vw,360px)] rotate-[4deg] rounded-2xl bg-card p-2.5 md:order-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <img src={assets.portrait} alt="Portrait of Daya Raj" className="aspect-[3/4] w-full rounded-xl object-cover object-[50%_25%]" />
          </figure>

          <div className="order-3 md:justify-self-end">
            <p className="max-w-xs text-lg leading-relaxed">Hi, I'm Daya Raj — a developer who enjoys turning ideas into useful, well-crafted digital experiences.</p>
            {assets.resume ? (
              <a href={assets.resume} target="_blank" rel="noopener noreferrer" className="eyebrow mt-8 inline-flex items-center gap-8 bg-primary px-6 py-4 text-primary-foreground hover:bg-accent">
                View resume <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
null
            )}
          </div>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow flex items-center gap-6 !text-[0.62rem]">Based in India <span className="hidden h-px w-56 bg-border sm:block" /></p>
          <p className="eyebrow !text-[0.62rem]">Ideas → Products → Impact</p>
        </footer>
      </main>
    </div>
  );
}
