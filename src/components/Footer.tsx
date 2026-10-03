import Link from "next/link";
import { FOOTER_NAV, LINKS, NAV, SITE, SOCIALS } from "@/data/site";
import { ButtonExternal, ExternalLink } from "@/components/ui";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-surface-2 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-sm text-mint">$ ./join --no-experience-needed</p>
            <p className="mt-1 text-lg font-semibold">Hang out with us on Discord.</p>
          </div>
          <ButtonExternal href={LINKS.discord}>Join the Discord</ButtonExternal>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold">{SITE.name}</p>
            <p className="mt-2 text-sm text-muted">{SITE.tagline}</p>
            <ExternalLink
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-block text-sm text-gold hover:underline"
            >
              {SITE.email}
            </ExternalLink>
          </div>
          <FooterList title="Explore" items={[...NAV, ...FOOTER_NAV]} />
          <div>
            <p className="mb-3 font-mono text-sm text-muted">Find us</p>
            <ul className="space-y-2 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <ExternalLink href={s.href} className="text-foreground hover:text-gold">
                    {s.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted">
          © {year} {SITE.name}. Student-run club at McMaster University. Not an official
          university website.
        </p>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-sm text-muted">{title}</p>
      <ul className="grid grid-cols-2 gap-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-foreground hover:text-gold">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
