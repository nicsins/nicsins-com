import { useState } from "react";
import { songs } from "@/lib/content";

export function SunoDeck() {
  const [active, setActive] = useState<string | null>(null);
  const song = songs.find((item) => item.id === active) ?? null;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-12">
      <div className="flex flex-col border border-fg/15 lg:col-span-4">
        {songs.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === active}
            className={
              item.id === active
                ? "flex items-center gap-4 border-b border-fg/15 bg-surface px-4 py-4 text-left last:border-b-0"
                : "flex items-center gap-4 border-b border-fg/15 px-4 py-4 text-left last:border-b-0 hover:bg-surface"
            }
            onClick={() => setActive(item.id)}
          >
            <img src={item.image} alt="" className="card-still card-still-sq" />
            <span>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">{item.time}</p>
              <p className="mt-2 font-serif text-3xl leading-none">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.style}</p>
            </span>
          </button>
        ))}
      </div>
      <div className="flex min-h-60 items-center justify-center border border-fg/15 bg-surface lg:col-span-8">
        {song ? (
          <div className="w-full">
            <iframe
              key={song.id}
              title={`${song.title} on Suno`}
              src={`https://suno.com/embed/${song.id}`}
              className="suno-frame"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-muted">
              <span>Played from Suno. nicsins.</span>
              <a
                className="underline decoration-primary/60 underline-offset-4 hover:text-fg"
                href={`https://suno.com/song/${song.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Open the song
              </a>
            </p>
          </div>
        ) : (
          <p className="px-8 text-center font-serif text-3xl italic text-muted">
            Pick a title. The player loads then.
          </p>
        )}
      </div>
    </div>
  );
}
