import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SiteNav } from "@/components/SiteNav";
import { GithubIcon, LeetcodeIcon, LinkedinIcon } from "@/components/BrandIcons";
import { contact, socials } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Daya Raj" },
      { name: "description", content: "Get in touch with Daya Raj — GitHub, LinkedIn, LeetCode and a contact form." },
      { property: "og:title", content: "Contact — Daya Raj" },
      { property: "og:description", content: "Let's build something together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const links = [
  { href: socials.github, label: "GitHub", Icon: GithubIcon },
  { href: socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: socials.leetcode, label: "LeetCode", Icon: LeetcodeIcon },
];

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const v = { name: g("name"), email: g("email"), subject: g("subject"), message: g("message") };
    const er: Errors = {};
    if (!v.name) er.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) er.email = "Please enter a valid email.";
    if (!v.subject) er.subject = "Please add a subject.";
    if (v.message.length < 10) er.message = "Message should be at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    // No delivery service is configured yet — be honest about it.
    setStatus("Message delivery isn't set up yet, so this wasn't sent. Please reach out via LinkedIn or GitHub for now.");
  }

  const field = "mt-2 w-full rounded-lg border border-on-dark/15 bg-charcoal-soft px-4 py-3 text-on-dark placeholder:text-on-dark-muted/60 focus:border-accent focus:outline-none";

  return (
    <div className="min-h-screen bg-charcoal text-on-dark">
      <SiteNav tone="dark" />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-12">
        <p className="eyebrow text-on-dark-muted">[ 05 ]</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">Let's build something <em className="text-accent">together.</em></h1>

        <div className="mt-14 grid gap-12 md:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <div className="space-y-4 text-on-dark-muted">
              <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> {contact.country}</p>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-on-dark"><Mail className="h-4 w-4 text-accent" /> {contact.email}</a>
              )}
            </div>
            <div>
              <p className="eyebrow mb-4 text-on-dark-muted">Profiles</p>
              <ul className="space-y-3">
                {links.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile (opens in new tab)`} className="flex items-center justify-between rounded-xl border border-on-dark/15 px-5 py-4 transition-colors hover:border-accent hover:text-accent">
                      <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {label}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-on-dark/10 p-6 md:p-8">
            {([
              ["name", "Full Name", "text"],
              ["email", "Email", "email"],
              ["subject", "Subject", "text"],
            ] as const).map(([id, label, type]) => (
              <div key={id}>
                <label htmlFor={id} className="eyebrow !text-[0.62rem] text-on-dark-muted">{label}</label>
                <input id={id} name={id} type={type} className={field} aria-invalid={!!errors[id]} aria-describedby={`${id}-err`} />
                {errors[id] && <p id={`${id}-err`} className="mt-1 text-sm text-accent">{errors[id]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="eyebrow !text-[0.62rem] text-on-dark-muted">Message</label>
              <textarea id="message" name="message" rows={5} className={field} aria-invalid={!!errors.message} aria-describedby="message-err" />
              {errors.message && <p id="message-err" className="mt-1 text-sm text-accent">{errors.message}</p>}
            </div>
            <button type="submit" className="eyebrow inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-accent-foreground hover:opacity-90">
              Send <ArrowUpRight className="h-4 w-4" />
            </button>
            {status && <p role="status" className="rounded-lg border border-on-dark/15 p-3 text-sm text-on-dark-muted">{status}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
