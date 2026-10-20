import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Daya Raj" },
      { name: "description", content: "Languages, frontend, backend, databases, AI/ML and tools Daya Raj works with." },
      { property: "og:title", content: "Skills — Daya Raj" },
      { property: "og:description", content: "The technologies Daya Raj builds and learns with." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Workspace view="skills" />,
});
