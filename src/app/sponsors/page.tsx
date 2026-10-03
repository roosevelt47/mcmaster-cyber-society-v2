import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE } from "@/data/site";
import { TIERS } from "@/data/sponsors";
import { ButtonExternal, Card, PageHeader, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Sponsor McMaster Cyber Society and connect with McMaster's next generation of security talent.",
};

const MAIL_SUBJECT = "Sponsorship inquiry: McMaster Cyber Society";

export default function SponsorsPage() {
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
  return (
    <>
      <PageHeader eyebrow="cat sponsorship.md" title="Sponsor the club">
        Help us run free workshops and send teams to competitions, and meet students who are
        learning security by doing.
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="packages" title="Sponsorship tiers">
          Draft tiers. Contact us and we will tailor a package to your goals.
        </SectionHeading>
        <ul className="grid gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <li key={tier.name}>
              <Card className="flex h-full flex-col">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 font-mono text-sm text-gold">{tier.amount}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden="true" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonExternal href={mailto}>Email us about sponsoring</ButtonExternal>
        </div>
      </Section>
    </>
  );
}
