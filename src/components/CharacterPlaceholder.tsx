// Lightweight placeholder shown while the 3D character model loads.
// Pure CSS, no animation libraries; the global reduced-motion rule pauses it.
export default function CharacterPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6" role="status" aria-label="Loading 3D character">
      <div className="flex flex-col items-center gap-2" aria-hidden>
        <div className="character-loading-part h-14 w-14 rounded-full bg-foreground/10" style={{ animationDelay: "0ms" }} />
        <div className="character-loading-part h-28 w-24 rounded-[2.5rem] bg-foreground/10" style={{ animationDelay: "180ms" }} />
        <div className="character-loading-part h-2 w-24 rounded-full bg-foreground/10" style={{ animationDelay: "360ms" }} />
      </div>
      <p className="eyebrow character-loading-part text-muted-foreground" style={{ animationDelay: "240ms" }}>
        Loading character
      </p>
    </div>
  );
}
