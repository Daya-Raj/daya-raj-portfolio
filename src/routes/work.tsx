import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/Workspace";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Daya Raj" },
      { name: "description", content: "GridPilot, BowlSense and Sahaayak — project concepts by Daya Raj." },
      { property: "og:title", content: "Work — Daya Raj" },
      { property: "og:description", content: "Selected project concepts: GridPilot, BowlSense, Sahaayak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Workspace view="projects" />,
});
