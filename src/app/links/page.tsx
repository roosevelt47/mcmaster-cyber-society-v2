import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, SOCIALS } from "@/data/site";
import { getNextEvent } from "@/lib/events";
import { ExternalLink } from "@/components/ui";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Links",
  description: "All McMaster Cyber Society links in one place.",
};

const ROW =
  "flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-3 font-semibold transition-colors hover:border-brand hover:bg-surface-2";

export default function LinksPage() {
  const next = getNextEvent();
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12">
      <Image src="/logo.png" alt="" width={72} height={80} priority />
      <h1 className="mt-4 text-2xl font-bold">{SITE.name}</h1>
      <p className="mt-1 text-center text-muted">{SITE.tagline}</p>

      <ul className="mt-8 w-full space-y-3">
        {next?.signupUrl && (
          <li>
            <ExternalLink
              href={next.signupUrl}
              className={`${ROW} border-brand bg-brand-soft`}
            >
              <span>
                <span className="block font-mono text-xs text-gold">Next event</span>
                {next.title}
              </span>
              <span aria-hidden="true">→</span>
            </ExternalLink>
          </li>
        )}
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <ExternalLink href={s.href} className={ROW}>
              <span>
                {s.label}
                <span className="block text-sm font-normal text-muted">{s.description}</span>
              </span>
              <span aria-hidden="true">→</span>
            </ExternalLink>
          </li>
        ))}
        <li>
          <Link href="/" className={ROW}>
            <span>Club website</span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
