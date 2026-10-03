import type { Metadata } from "next";
import { TEAM } from "@/data/team";
import { SITE } from "@/data/site";
import { ButtonLink, Card, ExternalLink, PageHeader, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Why join McMaster Cyber Society, what we do, and who we are.",
};

const REASONS = [
  {
    title: "Zero experience needed",
    body: "We teach from the ground up. If you can use a laptop, you can start.",
  },
  {
    title: "Skills employers ask for",
    body: "Linux, networking, web security and incident thinking. The things on real job postings.",
  },
  {
    title: "Compete as a team",
    body: "Play real CTFs with friends. Nothing teaches faster than a scoreboard and teammates.",
  },
  {
    title: "Meet people in the industry",
    body: "Guest speakers, sponsors and alumni who can point you toward co-ops and careers.",
  },
] as const;

export default function AboutPage() {
  const hasRealTeam = TEAM.some((m) => m.name !== "Position Open");
  return (
    <>
      <PageHeader eyebrow="cat about.md" title="About the club">
        {SITE.name} is a student-run club focused on cybersecurity education, hands-on workshops,
        capture-the-flag competitions and community.
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="why join" title="Why you should join" />
        <ul className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((r) => (
            <li key={r.title}>
              <Card className="h-full">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted">{r.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="the team" title="Meet the executive team" />
        {hasRealTeam ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m) => (
              <li key={m.role}>
                <Card className="h-full">
                  <div
                    className="mb-3 flex size-12 items-center justify-center rounded-full bg-brand font-bold"
                    aria-hidden="true"
                  >
                    {m.name[0]}
                  </div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-gold">{m.role}</p>
                  <p className="mt-1 text-sm text-muted">{m.blurb}</p>
                  {m.linkedinUrl && (
                    <ExternalLink
                      href={m.linkedinUrl}
                      className="mt-2 inline-block text-sm text-gold hover:underline"
                    >
                      LinkedIn
                    </ExternalLink>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <p className="font-semibold">We are forming our executive team.</p>
            <p className="mt-2 text-sm text-muted">
              Want to help run the club? Email{" "}
              <ExternalLink href={`mailto:${SITE.email}`} className="text-gold hover:underline">
                {SITE.email}
              </ExternalLink>
              .
            </p>
          </Card>
        )}
      </Section>

      <Section className="pt-0">
        <ButtonLink href="/join">How to join</ButtonLink>
      </Section>
    </>
  );
}
