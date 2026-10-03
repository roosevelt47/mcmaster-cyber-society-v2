import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors";

const BUTTON_VARIANTS: Readonly<Record<ButtonVariant, string>> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-border bg-surface-2 text-foreground hover:border-muted",
  ghost: "text-muted hover:text-foreground",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${extra}`.trim();
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

/** Internal link styled as a button. */
export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

/** External link. Always opens safely in a new tab. Only http(s) and mailto are rendered as links. */
export function ExternalLink({
  href,
  children,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isMail = href.startsWith("mailto:");
  const isHttp = /^https?:\/\//i.test(href);
  if (!isMail && !isHttp) return <span className={className}>{children}</span>;
  return (
    <a
      href={href}
      className={className}
      {...rest}
      {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function ButtonExternal({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <ExternalLink href={href} className={buttonClass(variant, className)}>
      {children}
    </ExternalLink>
  );
}

export function Card({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

type BadgeTone = "brand" | "gold" | "mint" | "neutral";

const BADGE_TONES: Readonly<Record<BadgeTone, string>> = {
  brand: "bg-brand-soft text-[#ff8a98]",
  gold: "bg-[#3a2d0f] text-gold",
  mint: "bg-[#0f2e1b] text-mint",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-medium ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="mb-2 font-mono text-sm text-mint">{`> ${eyebrow}`}</p>}
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mb-3 font-mono text-sm text-mint">{`$ ${eyebrow}`}</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {children && <p className="mt-4 max-w-2xl text-lg text-muted">{children}</p>}
      </div>
    </header>
  );
}
