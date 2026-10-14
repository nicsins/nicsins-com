import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteReel } from "@/components/site-reel";
import { code, partners } from "@/lib/content";

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "Sites — nicsins" },
      {
        name: "description",
        content:
          "Every nicsins site that answered: games, the shop, and the small tools. Quiet deploys point at the code.",
      },
    ],
  }),
  component: SitesPage,
});

function SitesPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Sites</p>
      <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-none sm:text-7xl">
        Every door that answered.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        Games, the shop, and the small tools. I left off templates, duplicates, and anything that
        did not respond. Swipe the reel, or use the arrows. It pauses when you rest on it.
      </p>
      <SiteReel />

      <h2 id="partners" className="mt-24 font-serif text-5xl leading-none md:text-6xl">
        Kwizzle’s doors.
      </h2>
      <p className="mt-6 max-w-2xl text-muted">
        Partner. Keith “Kwizz” Severson,{" "}
        <a
          className="text-fg underline decoration-primary/60 underline-offset-4"
          href="https://github.com/kwizzlesurp10-ctrl"
          target="_blank"
          rel="noreferrer"
        >
          kwizzlesurp
        </a>
        . Same rule: only the ones that answered.
      </p>
      <SiteReel doors={partners} label="Kwizzle" />

      <h2 className="mt-20 font-serif text-4xl leading-none">Quiet, so the code is the link.</h2>
      <ul className="mt-8 border-t border-fg/15">
        {code.map((item) => (
          <li key={item.href} className="border-b border-fg/15">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="host group grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <h3 className="flex items-center gap-2 font-serif text-2xl text-fg group-hover:text-primary md:col-span-4">
                {item.name}
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </h3>
              <p className="text-muted group-hover:text-fg md:col-span-8">{item.line}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
