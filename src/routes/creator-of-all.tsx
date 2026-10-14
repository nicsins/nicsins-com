import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtocolWalk } from "@/components/protocol-walk";
import { bench, stages } from "@/lib/content";

export const Route = createFileRoute("/creator-of-all")({
  head: () => ({
    meta: [
      { title: "Creator of All — nicsins" },
      {
        name: "description",
        content:
          "A working note by Nic Beltrante. Four stages for finishing a thing, and the bio behind the habit.",
      },
    ],
  }),
  component: CreatorOfAll,
});

function CreatorOfAll() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-16 md:px-8 md:pt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            A working note · not a title
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl md:text-8xl">
            Creator of All<span className="text-primary">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Just a checklist I use so a project does not die in a chat window. Name the outcome,
            cut a path, do it where it has to live, write down what surprised you. The name is
            older than the humility. The humility is the part that matters.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#walk" className="btn btn-primary">
              Walk an intent
            </a>
            <a href="#bio" className="btn btn-ghost">
              The bio
            </a>
          </div>
        </div>

        <dl className="border border-fg/15 bg-surface p-6 font-mono text-sm leading-relaxed lg:col-span-5">
          <Row k="name" v="creator-of-all" />
          <Row k="author" v="Nic Beltrante" />
          <Row k="handle" v="nicsins" />
          <Row k="kind" v="autonomous agent protocol" />
          <Row k="stages" v="intent · plan · produce · evolve" />
          <Row k="done" v="the next run is cheaper" />
          <Row k="rule" v="the golden one" />
        </dl>
      </section>

      <section id="bio" className="border-t border-fg/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Bio</p>
            <h2 className="mt-4 font-serif text-4xl leading-none md:text-5xl">
              Who wrote the note.
            </h2>
          </div>
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed lg:col-span-8">
            <p>
              I’m Nic Beltrante. On the wire that’s nicsins. I build from Minneapolis, and I keep
              one standing order: treat the person, and the system, the way you want to be treated
              when you are the one who has to live with the result.
            </p>
            <p>
              In 1994 I was a 97E, a human-intelligence collector with the 525th Military
              Intelligence Brigade, airborne, in Haiti for Operation Uphold Democracy. The work was
              people. What they would say, what they would not, and how to write it so the next
              soldier did not have to learn it the hard way. Those reports went to the Library of
              Congress. The unit came home with a Meritorious Unit Citation. I came home with a
              Humanitarian Service Medal, an Army Commendation Medal, two Army Achievement Medals,
              an Armed Forces Expeditionary Medal, and a habit I never put down. If it matters,
              write the doctrine.
            </p>
            <p>
              The years after the uniform went into cybersecurity. Penetration testing, secure
              review, zero trust, cryptography, threat modeling, forensics. Same job, different
              room. Find the truth of a system before someone else spends the gap.
            </p>
            <p>
              This page is that habit written down. Most “autonomous” setups are a prompt that
              forgets itself. I wanted a few stages and a requirement that the lesson get written
              back. It is a note, not a crown. I use it when I would otherwise stop at the plan.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-fg/10 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">The contract</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            Four stages. Then you stop and check.
          </h2>
          <ol className="mt-14 border-t border-fg/15">
            {stages.map((stage) => (
              <li
                key={stage.index}
                className="grid items-center gap-6 border-b border-fg/15 py-10 md:grid-cols-12 md:gap-8"
              >
                <img src={stage.image} alt="" className="card-still md:col-span-4" />
                <div className="md:col-span-8">
                  <p className="font-mono text-sm text-primary">
                    {stage.index}
                    <span className="mt-2 block text-fg">{stage.code}</span>
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-none md:text-4xl">{stage.title}</h3>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl">Use it when</h3>
              <ul className="mt-4 space-y-3 text-muted">
                <li>The project should still be true next week.</li>
                <li>The agent has to research, decide, build, and verify.</li>
                <li>You want the method to improve, not only the artifact.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-2xl">Leave it when</h3>
              <ul className="mt-4 space-y-3 text-muted">
                <li>The answer is one fact and then you are done.</li>
                <li>Money, safety, or consent needs a human before anything acts.</li>
                <li>You cannot say what done looks like. Stop and name it.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="walk" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Run</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
          Hand it a sentence.
        </h2>
        <p className="mt-6 max-w-2xl text-muted">
          This walker does not pretend to be a model. It shows the shape of the protocol with your
          words in it, so you can see where a real run would have to prove itself.
        </p>
        <div className="mt-12">
          <ProtocolWalk />
        </div>
      </section>

      <section className="border-t border-fg/10 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Beside it</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-none md:text-6xl">
            Other notes I keep nearby.
          </h2>
          <div className="mt-14 flex flex-col gap-16">
            {bench
              .filter((skill) => skill.id !== "creator-of-all")
              .map((skill) => (
                <article id={skill.id} key={skill.id} className="grid items-center gap-6 md:grid-cols-12 md:gap-8">
                  <img src={skill.image} alt="" className="card-still md:col-span-4" />
                  <div className="md:col-span-8">
                    <h3 className="font-mono text-sm text-primary">{skill.name}</h3>
                    <p className="mt-3 font-serif text-3xl leading-snug">{skill.use}</p>
                    <p className="mt-4 max-w-2xl leading-relaxed text-muted">{skill.body}</p>
                  </div>
                </article>
              ))}
          </div>
          <p className="mt-16 text-sm text-muted">
            A checklist, nothing more.{" "}
            <Link to="/" hash="goals" className="text-fg underline decoration-primary/60 underline-offset-4">
              Back to the goals.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-fg/10 py-2.5 last:border-b-0">
      <dt className="text-muted">{k}</dt>
      <dd className="col-span-2 text-fg">{v}</dd>
    </div>
  );
}
