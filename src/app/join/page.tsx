import type { Metadata } from "next";
import { FAQ } from "@/data/faq";
import { LINKS } from "@/data/site";
import { ButtonExternal, ButtonLink, Card, PageHeader, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join",
  description: "How to join McMaster Cyber Society in three steps. It is free and open to everyone.",
};

const STEPS = [
  {
    title: "Join the Discord",
    body: "Announcements, questions and CTF team-ups happen here first.",
  },
  {
    title: "Come to a session",
    body: "Pick any upcoming event and sign up. Walk-ins are welcome too.",
  },
  {
    title: "Try a challenge",
    body: "Warm up with the daily challenge or the Start Here roadmap.",
  },
] as const;

export default function JoinPage() {
  return (
    <>
      <PageHeader eyebrow="./join" title="Join the club">
        Free, open to every McMaster student, and no experience required.
      </PageHeader>

      <Section>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <p className="font-mono text-3xl font-bold text-gold">{i + 1}</p>
                <h2 className="mt-2 font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonExternal href={LINKS.discord}>Join the Discord</ButtonExternal>
          <ButtonLink href="/events" variant="secondary">
            Find an event
          </ButtonLink>
        </div>
      </Section>

      <Section className="max-w-3xl">
        <SectionHeading eyebrow="faq" title="Questions" />
        <div className="divide-y divide-border rounded-xl border border-border bg-surface">
          {FAQ.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                <span className="mr-2 font-mono text-mint group-open:hidden">+</span>
                <span className="mr-2 hidden font-mono text-mint group-open:inline">−</span>
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
