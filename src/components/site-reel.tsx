import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { sites, type SiteDoor } from "@/lib/content";

export function SiteReel({
  doors = sites,
  label = "Sites that answer",
}: {
  doors?: SiteDoor[];
  label?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const goRef = useRef<(next: number) => void>(() => {});
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [kind, setKind] = useState<string>("All");
  const filters = ["All", ...Array.from(new Set(doors.map((door) => door.kind)))];
  const items = kind === "All" ? doors : doors.filter((door) => door.kind === kind);

  goRef.current = (next: number) => {
    const root = scroller.current;
    if (!root || items.length === 0) return;
    const n = ((next % items.length) + items.length) % items.length;
    const card = root.children[n] as HTMLElement | undefined;
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollTo({ left: card.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    indexRef.current = n;
    setIndex(n);
  };

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    scroller.current?.scrollTo({ left: 0 });
  }, [kind]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const n = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isNaN(n)) return;
        indexRef.current = n;
        setIndex(n);
      },
      { root, threshold: [0.55, 0.75] },
    );
    for (const child of root.children) observer.observe(child);
    return () => observer.disconnect();
  }, [kind]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused || hold || items.length < 2) return;
    const id = window.setInterval(() => goRef.current(indexRef.current + 1), 6500);
    return () => window.clearInterval(id);
  }, [paused, hold, kind, items.length]);

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {filters.length > 2 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sites">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={kind === item}
                className={
                  kind === item
                    ? "inline-flex min-h-11 items-center border border-primary bg-primary px-4 font-mono text-xs uppercase tracking-widest text-bg"
                    : "inline-flex min-h-11 items-center border border-fg/20 px-4 font-mono text-xs uppercase tracking-widest text-muted hover:text-fg"
                }
                onClick={() => setKind(item)}
              >
                {item}
              </button>
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-widest text-muted">{label}</p>
        )}
        <div className="flex items-center gap-2">
          <p className="mr-2 font-mono text-xs tabular-nums text-muted" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
          <button type="button" className="reel-btn" aria-label="Previous site" onClick={() => goRef.current(index - 1)}>
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="reel-btn"
            aria-pressed={paused}
            aria-label={paused ? "Play the reel" : "Pause the reel"}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
          <button type="button" className="reel-btn" aria-label="Next site" onClick={() => goRef.current(index + 1)}>
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="reel mt-6"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goRef.current(indexRef.current + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goRef.current(indexRef.current - 1);
          }
        }}
      >
        {items.map((site, i) => (
          <article
            key={site.href}
            data-index={i}
            className="reel-card flex flex-col bg-bg p-4 md:p-5"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${site.name}`}
          >
            <div className="window">
              <div className="window-bar">
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <p className="truncate font-mono text-xs text-muted">{site.host}</p>
              </div>
              <img
                src={`/windows/${site.host.replace(/^www\./, "")}.jpg`}
                alt={`${site.name} — the page as it looks right now`}
                className="window-shot"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">{site.kind}</p>
              <h3 className="mt-3 font-serif text-4xl leading-none md:text-5xl">{site.name}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{site.line}</p>
              <a href={site.href} target="_blank" rel="noreferrer" className="btn btn-primary mt-6 self-start">
                Open
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
