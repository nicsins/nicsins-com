import { useState, type FormEvent } from "react";

const TO = "nicsins@gmail.com";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();

    if (name.length < 1 || name.length > 80) {
      setStatus("error");
      setError("A name, please. Short is fine.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      setStatus("error");
      setError("That email does not look usable.");
      return;
    }
    if (message.length < 8 || message.length > 4000) {
      setStatus("error");
      setError("Say a little more than a word, and less than a letter.");
      return;
    }
    if (company) {
      form.reset();
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TO}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `nicsins — ${name}`,
          _template: "box",
          _captcha: "false",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      const detail = body.message ?? "";
      if (/activat/i.test(detail)) {
        setStatus("error");
        setError("The mailbox has to confirm this form once. Check nicsins@gmail.com, then send again.");
        return;
      }
      if (/rate limit/i.test(detail)) {
        setStatus("error");
        setError("Too many at once. Wait a minute, or use the address.");
        return;
      }
      if (!response.ok || body.success === false || body.success === "false") {
        setStatus("error");
        setError("It did not go. Write the address directly.");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("It did not go. Write the address directly.");
    }
  }

  return (
    <form className="mt-12 grid max-w-xl gap-5" onSubmit={onSubmit} noValidate>
      <label className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">Name</span>
        <input className="field field-line" name="name" autoComplete="name" required maxLength={80} />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">Email</span>
        <input
          className="field field-line"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={120}
        />
      </label>
      <label className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">The problem</span>
        <textarea className="field" name="message" required minLength={8} maxLength={4000} rows={6} />
      </label>
      <label className="hp" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send"}
        </button>
        {status === "sent" ? (
          <p className="text-sm text-muted">Sent. If it matters, it will get an answer.</p>
        ) : null}
        {status === "error" ? <p className="text-sm text-primary">{error}</p> : null}
      </div>
    </form>
  );
}
