import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";

const TO = "nicsins@gmail.com";

type Field = "name" | "email" | "message";

const FIELDS: Field[] = ["name", "email", "message"];

function problem(field: Field, value: string): string {
  const text = value.trim();
  if (field === "name") {
    if (!text) return "A name, please. Short is fine.";
    if (text.length > 80) return "Shorter than that.";
  }
  if (field === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) || text.length > 120) {
      return "That email does not look usable.";
    }
  }
  if (field === "message") {
    if (text.length < 8) return "Say a little more than a word.";
    if (text.length > 4000) return "Less than a letter.";
  }
  return "";
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [seen, setSeen] = useState<Partial<Record<Field, boolean>>>({});

  function show(field: Field, value: string) {
    const next = problem(field, value);
    setErrors((current) => ({ ...current, [field]: next || undefined }));
    return next;
  }

  function onBlur(field: Field, value: string) {
    setSeen((current) => ({ ...current, [field]: true }));
    show(field, value);
  }

  function onChange(field: Field, value: string) {
    if (seen[field] || errors[field]) show(field, value);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const next: Partial<Record<Field, string>> = {};
    for (const field of FIELDS) {
      const issue = problem(field, values[field]);
      if (issue) next[field] = issue;
    }
    setSeen({ name: true, email: true, message: true });
    setErrors(next);
    const first = FIELDS.find((field) => next[field]);
    if (first) {
      const node = form.elements.namedItem(first);
      if (node instanceof HTMLElement) {
        node.scrollIntoView({ block: "nearest" });
        node.focus();
      }
      setStatus("idle");
      setNotice("");
      return;
    }

    if (String(data.get("company") ?? "").trim()) {
      form.reset();
      setStatus("sent");
      setNotice("Sent. If it matters, it will get an answer.");
      return;
    }

    setStatus("sending");
    setNotice("");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TO}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _replyto: values.email.trim(),
          _subject: `nicsins — ${values.name.trim()}`,
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
        setNotice("The mailbox has to confirm this form once. Check nicsins@gmail.com, then send again.");
        return;
      }
      if (/rate limit/i.test(detail)) {
        setStatus("error");
        setNotice("Too many at once. Wait a minute, or use the address.");
        return;
      }
      if (!response.ok || body.success === false || body.success === "false") {
        setStatus("error");
        setNotice("It did not go. Write the address directly.");
        return;
      }
      form.reset();
      setErrors({});
      setSeen({});
      setStatus("sent");
      setNotice("Sent. If it matters, it will get an answer.");
    } catch {
      setStatus("error");
      setNotice("It did not go. Write the address directly.");
    }
  }

  return (
    <form className="mt-12 grid max-w-xl gap-5" onSubmit={onSubmit} noValidate>
      <Field
        name="name"
        label="Name"
        error={errors.name}
        autoComplete="name"
        maxLength={80}
        onBlur={onBlur}
        onChange={onChange}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        error={errors.email}
        autoComplete="email"
        maxLength={120}
        onBlur={onBlur}
        onChange={onChange}
      />
      <Field
        name="message"
        label="The problem"
        error={errors.message}
        maxLength={4000}
        rows={6}
        onBlur={onBlur}
        onChange={onChange}
      />
      <label className="hp" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send"}
        </button>
        {notice ? (
          <p className={status === "error" ? "text-sm text-primary" : "text-sm text-muted"} role="status">
            {notice}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  error,
  type,
  autoComplete,
  maxLength,
  rows,
  onBlur,
  onChange,
}: {
  name: Field;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  maxLength: number;
  rows?: number;
  onBlur: (field: Field, value: string) => void;
  onChange: (field: Field, value: string) => void;
}) {
  const errorId = `${name}-error`;
  const shared = {
    className: "field field-line",
    name,
    id: name,
    required: true,
    maxLength,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onBlur(name, event.currentTarget.value),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, event.currentTarget.value),
  };

  return (
    <label className="grid gap-2" htmlFor={name}>
      <span className="font-mono text-xs uppercase tracking-widest text-primary">{label}</span>
      {rows ? (
        <textarea {...shared} className="field" rows={rows} />
      ) : (
        <input {...shared} type={type ?? "text"} />
      )}
      {error ? (
        <p id={errorId} className="text-sm text-primary">
          {error}
        </p>
      ) : null}
    </label>
  );
}
