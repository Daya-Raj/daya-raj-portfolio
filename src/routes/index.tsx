import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { useWorkReveal } from "@/components/WorkReveal";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { contact, socials } from "@/config/site";
import CharacterPlaceholder from "@/components/CharacterPlaceholder";

const CharacterScene = lazy(() => import("@/components/CharacterScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daya Raj — Software Developer & AI/ML Enthusiast" },
      { name: "description", content: "Daya Raj builds digital experiences that solve real problems, across web development and AI/ML." },
      { property: "og:title", content: "Daya Raj — Software Developer" },
      { property: "og:description", content: "Digital experiences that solve real problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { openWork } = useWorkReveal();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="home-page relative flex min-h-svh flex-col overflow-x-hidden bg-background">
      <SiteNav />
      <main className="home-composition relative mx-auto grid w-full max-w-[1400px] flex-1 px-6 pb-6 md:px-12">
        {/* Giant serif name behind the character */}
        <h1 className="home-name pointer-events-none relative z-0 select-none text-center font-serif font-medium leading-none text-charcoal-soft">
          DAYA&nbsp;&nbsp;&nbsp;RAJ
        </h1>

        <div className="home-character absolute left-1/2 z-10 w-[min(92%,520px)] -translate-x-1/2">
          {mounted && (
            <Suspense fallback={<CharacterPlaceholder />}>
              <CharacterScene />
            </Suspense>
          )}
        </div>

        <div className="absolute left-6 top-16 hidden md:left-12 md:block">
          <p className="eyebrow text-muted-foreground">[ 01 ]</p>
          <p className="eyebrow mt-6 leading-6">Software developer<br />AI/ML enthusiast</p>
        </div>

        <aside className="absolute right-6 top-24 hidden border-l pl-5 md:right-12 lg:block">
          <p className="eyebrow mb-5 text-muted-foreground">[ 02 ]</p>
          <span className="absolute -left-px top-10 h-6 w-0.5 bg-accent" />
          <ul className="space-y-3 text-[0.65rem] font-semibold uppercase tracking-[0.25em]">
            {["Ideas", "Code", "Build", "Improve", "Repeat"].map((w) => <li key={w}>{w}</li>)}
          </ul>
        </aside>

        <div className="home-intro relative z-20 max-w-sm">
          <span className="block h-0.5 w-8 bg-accent" />
          <p className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
            I build digital experiences that solve <span className="text-muted-foreground">real problems.</span>
          </p>
          <button
            onClick={(e) => openWork(e.clientX, e.clientY)}
            className="group mt-8 flex items-center gap-5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="eyebrow">Explore my work</span>
          </button>
        </div>

        <footer className="home-footer relative z-20 flex items-center gap-6">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><GithubIcon className="h-5 w-5" /></a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><LinkedinIcon className="h-5 w-5" /></a>
          {contact.email ? (
            <a href={`mailto:${contact.email}`} aria-label="Email"><Mail className="h-5 w-5" /></a>
          ) : (
            <Link to="/contact" aria-label="Contact page"><Mail className="h-5 w-5" /></Link>
          )}
          <span className="h-px flex-1 bg-border" />
          <p className="eyebrow hidden text-right !text-[0.6rem] sm:block">
            <span className="text-muted-foreground">Currently exploring</span><br />AI × real world products
          </p>
        </footer>
      </main>
    </div>
  );
}
