import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { SiteReel } from "@/components/site-reel";
import { SunoDeck } from "@/components/suno-deck";
import { eras, goals, partners } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "nicsins — Nic Beltrante" },
      {
        name: "description",
        content:
          "Nic Beltrante. A few goals: a place a town can copy, paperwork that finishes, small tools that tell the truth. Live sites and the field record.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden">
        <p aria-hidden="true" className="watermark pointer-events-none absolute right-0 bottom-0 font-serif italic text-fg">
          nb
        </p>
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
          <p className="rise flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-primary">
            <span className="dot-live inline-block size-1.5 rounded-full bg-leaf" aria-hidden="true" />
            Minneapolis · still learning
          </p>
          <h1 className="rise draw mt-6 max-w-4xl pb-3 font-serif text-5xl leading-none text-fg sm:text-7xl md:text-8xl">
            A few things worth <em className="text-primary">finishing.</em>
          </h1>
          <p className="rise rise-3 mt-8 max-w-xl text-lg leading-relaxed text-muted">
            I’m Nic Beltrante. I used to collect intelligence for the Army. These days I try to
            leave the next person a little better off: a place, a tool, a form that actually gets
            done. Useful beats impressive.
          </p>
          <div className="rise rise-4 mt-10 flex flex-wrap gap-3">
            <Link to="/" hash="goals" className="btn btn-primary">
              The goals
            </Link>
            <Link to="/sites" className="btn btn-ghost">
              Every site
            </Link>
          </div>
        </div>
      </section>

      <section id="listen" className="wash-gold border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">01 · Listen</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            Two songs. Press one.
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Both are on Suno under nicsins. The player is theirs, so the file stays where it was
            made. Pick a title and it loads.
          </p>
          <SunoDeck />
        </div>
      </section>

      <section id="goals" className="wash-leaf border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">02 · Goals</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            What we’re aiming at.
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Not a manifesto. Four things I keep coming back to, with whoever is willing to work on
            them. If a better version shows up, this list should change.
          </p>
          <ol className="mt-12 border-t border-fg/15">
            {goals.map((item) => (
              <li
                key={item.index}
                className="grid gap-6 border-b border-fg/15 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10"
              >
                <img src={item.image} alt="" className="card-still md:col-span-4" />
                <div className="grid gap-3 md:col-span-8 md:grid-cols-8 md:gap-8">
                  <p className="font-mono text-sm text-primary md:col-span-2">{item.index}</p>
                  <h3 className="font-serif text-3xl leading-none md:col-span-6">{item.title}</h3>
                  <p className="leading-relaxed text-muted md:col-span-6 md:col-start-3">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="live" className="wash-flare border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-flare">03 · Sites</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            Doors that answered.
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Swipe the reel. It pauses if you rest on it. Templates and anything that stayed quiet
            are not in here.
          </p>
          <SiteReel />
        </div>
      </section>

      <section id="partners" className="wash-leaf border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-leaf">04 · Partners</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            Kwizzle.
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Keith “Kwizz” Severson,{" "}
            <a
              className="text-fg underline decoration-primary/60 underline-offset-4"
              href="https://github.com/kwizzlesurp10-ctrl"
              target="_blank"
              rel="noreferrer"
            >
              kwizzlesurp
            </a>
            . These doors are his. I checked that they answer, then I got out of the way.
          </p>
          <SiteReel doors={partners} label="Kwizzle" />
        </div>
      </section>

      <section id="field" className="border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-flare">05 · Field record</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
          Where the habit came from.
        </h2>
        <ol className="mt-14">
          {eras.map((era) => (
            <li key={era.when} className="grid gap-6 border-t border-fg/15 py-10 md:grid-cols-12 md:items-center md:gap-8">
              <img src={era.image} alt="" className="card-still md:col-span-4" />
              <div className="md:col-span-8">
                <p className="font-mono text-sm text-primary tabular-nums">{era.when}</p>
                <h3 className="mt-3 font-serif text-3xl leading-none md:text-4xl">{era.title}</h3>
                <p className="mt-4 max-w-3xl leading-relaxed text-muted">{era.body}</p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </section>

      <section id="contact" className="wash-gold border-t border-fg/10">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">06 · Contact</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            If it is a real problem, write.
          </h2>
          <a
            href="mailto:nicsins@gmail.com"
            className="mt-10 inline-block max-w-full font-serif text-3xl italic leading-tight underline decoration-primary/60 underline-offset-8 hover:text-primary sm:text-5xl"
          >
            nicsins@gmail.com
          </a>
          <p className="mt-6 max-w-lg text-muted">
            A cooperative that needs to become a thing, a form someone cannot finish alone, or a
            system that is lying about itself. Minneapolis.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
