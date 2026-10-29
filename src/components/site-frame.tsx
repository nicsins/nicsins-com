import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Mark } from "@/components/mark";

const nav = [
  { label: "Goals", to: "/", hash: "goals" },
  { label: "Sites", to: "/sites" },
  { label: "Kwizzle", to: "/", hash: "partners" },
  { label: "Listen", to: "/", hash: "listen" },
  { label: "Field", to: "/", hash: "field" },
  { label: "Contact", to: "/", hash: "contact" },
] as const;

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="tiger-top" aria-hidden="true" />
      <div className="tiger-rail" aria-hidden="true" />
      <div className="md:pl-3">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-fg/10 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex min-h-11 items-center gap-3">
          <Mark className="size-8 shrink-0" />
          <span className="font-serif text-2xl italic leading-none">nicsins</span>
          <span className="hidden text-sm text-muted md:inline">Nic Beltrante</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-fg/10 bg-bg px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.label}>
                <NavItem item={item} large />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function NavItem({
  item,
  large,
}: {
  item: (typeof nav)[number];
  large?: boolean;
}) {
  const hash = "hash" in item ? item.hash : undefined;
  if (large) {
    return (
      <Link
        to={item.to}
        hash={hash}
        className="flex min-h-11 items-center font-serif text-3xl text-fg"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      to={item.to}
      hash={hash}
      activeOptions={{ exact: true, includeHash: Boolean(hash) }}
      activeProps={{ className: "text-sm text-primary" }}
      inactiveProps={{
        className: "text-sm text-muted transition-colors duration-200 hover:text-fg",
      }}
    >
      {item.label}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-fg/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-serif text-4xl italic leading-none">nicsins</p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            The Golden Rule still applies.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <li>
            <a
              className="inline-flex min-h-11 items-center underline decoration-primary/50 underline-offset-4 hover:text-primary"
              href="https://github.com/nicsins"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              className="inline-flex min-h-11 items-center underline decoration-primary/50 underline-offset-4 hover:text-primary"
              href="https://x.com/NSins7202"
              target="_blank"
              rel="noreferrer"
            >
              @NSins7202
            </a>
          </li>
          <li>
            <a
              className="inline-flex min-h-11 items-center underline decoration-primary/50 underline-offset-4 hover:text-primary"
              href="mailto:nicsins@gmail.com"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-24 md:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">404 · missing file</p>
      <h1 className="mt-4 max-w-xl font-serif text-5xl leading-none md:text-7xl">
        This page is not in the drawer.
      </h1>
      <Link to="/" className="btn btn-primary mt-10 w-fit">
        Back to the desk
      </Link>
    </div>
  );
}
