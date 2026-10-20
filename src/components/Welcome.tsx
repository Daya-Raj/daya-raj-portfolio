import { lazy, Suspense, useEffect, useState } from "react";
import "@/shaders/threeui.css";

// Exact ThreeUI GalleryHeading (registered source bundle), loaded client-side only.
const GalleryHeading = lazy(() =>
  import("@/shaders/neuform-isolated/NeuformIsolatedEffects").then((m) => ({ default: m.GalleryHeading })),
);

const DURATION = 5200;

/** ThreeUI "Matte Rise" welcome. Shown once per browser session; skippable. */
export function Welcome() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("dr-welcome")) return;
    sessionStorage.setItem("dr-welcome", "1");
    setShow(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setLeaving(true), reduce ? 1500 : DURATION);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setShow(false), 700);
    return () => window.clearTimeout(t);
  }, [leaving]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLeaving(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Welcome"
      className="fixed inset-0 z-[90] bg-charcoal transition-opacity duration-700"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <div className="shader-frame absolute inset-0">
        <Suspense fallback={null}>
          <GalleryHeading
            variant="rising-diagonal"
            mode="dark"
            font="sans"
            weight="400"
            headlineSize={1.15}
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </Suspense>
      </div>
      <button
        onClick={() => setLeaving(true)}
        className="eyebrow absolute bottom-8 right-8 rounded-full border border-on-dark/30 px-5 py-2.5 text-on-dark hover:bg-on-dark/10"
      >
        Skip
      </button>
    </div>
  );
}
