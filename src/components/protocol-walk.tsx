import { useState, type FormEvent } from "react";

type Step = {
  stage: string;
  name: string;
  action: string;
  check: string;
};

const SAMPLE =
  "A voice agent that walks a veteran through a benefits packet without making it a second job.";

function buildWalk(intent: string): Step[] {
  const line = intent.replace(/\s+/g, " ").trim().slice(0, 220);
  return [
    {
      stage: "01",
      name: "Intent",
      action: `Done means: ${line}`,
      check: "A stranger can point at the finished thing.",
    },
    {
      stage: "02",
      name: "Plan",
      action: `Cut “${line}” into the smallest steps that can fail loudly.`,
      check: "Every step has an input, an action, and a proof.",
    },
    {
      stage: "03",
      name: "Produce",
      action: "Run the first step where the result actually has to live.",
      check: "The artifact exists. The check passes. Nothing simulated.",
    },
    {
      stage: "04",
      name: "Evolve",
      action: `Write down what surprised you while making “${line}”.`,
      check: "The next run is shorter, or the skill says why it is not.",
    },
  ];
}

export function ProtocolWalk() {
  const [intent, setIntent] = useState(SAMPLE);
  const [run, setRun] = useState<Step[]>(() => buildWalk(SAMPLE));
  const [note, setNote] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next = intent.replace(/\s+/g, " ").trim();
    if (next.length < 8) {
      setNote("Name the outcome in one sentence. A short line is enough.");
      return;
    }
    setNote("");
    setRun(buildWalk(next));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form onSubmit={onSubmit} className="lg:col-span-5">
        <label htmlFor="intent" className="font-mono text-xs uppercase tracking-widest text-primary">
          Intent
        </label>
        <textarea
          id="intent"
          className="field mt-3"
          value={intent}
          maxLength={220}
          onChange={(event) => setIntent(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary">
            Walk the four stages
          </button>
          <p className="text-sm text-muted" aria-live="polite">
            {note || "The method, not a model. Your sentence, the contract."}
          </p>
        </div>
      </form>

      <ol className="border-t border-fg/15 lg:col-span-7" aria-live="polite">
        {run.map((step) => (
          <li key={step.stage} className="grid gap-2 border-b border-fg/15 py-5 sm:grid-cols-12 sm:gap-4">
            <p className="font-mono text-sm text-primary sm:col-span-3">
              {step.stage} {step.name}
            </p>
            <div className="sm:col-span-9">
              <p>{step.action}</p>
              <p className="mt-2 text-sm text-muted">Check · {step.check}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
