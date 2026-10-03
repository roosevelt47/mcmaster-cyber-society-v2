import Link from "next/link";
import { Flag, Terminal, Users, Wrench } from "lucide-react";
import { CTF_RESULTS } from "@/data/ctf";
import { MEMBER_COUNT, LINKS } from "@/data/site";
import { SPONSORS } from "@/data/sponsors";
import { WORKSHOPS } from "@/data/workshops";
import { getNextEvent, getPastEvents, getUpcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { NextEventHero } from "@/components/NextEventHero";
import {
  ButtonExternal,
  ButtonLink,
  Card,
  Section,
  SectionHeading,
} from "@/components/ui";

// Re-evaluate "upcoming" at most hourly without a redeploy.
export const revalidate = 3600;

const OFFERS = [
  {
    icon: Terminal,
    title: "Weekly CTF sessions",
    body: "Solve challenges together every week. Beginners welcome, no laptop skills assumed.",
  },
  {
    icon: Wrench,
    title: "Hands-on workshops",
    body: "Web, crypto, forensics and more, taught from scratch on practice labs.",
  },
  {
    icon: Flag,
    title: "Competitions",
    body: "We play national and international CTFs as a team. Join us or just watch and learn.",
  },
  {
    icon: Users,
    title: "A real community",
    body: "Study groups, guest speakers and friends who like breaking things (legally).",
  },
] as const;

export default function HomePage() {
  const next = getNextEvent();
  const upcoming = getUpcomingEvents().slice(0, 3);
  const past = getPastEvents().slice(0, 3);

  const stats = [
    { value: getPastEvents().length, label: "events held" },
    { value: CTF_RESULTS.length, label: "CTFs played" },
    { value: WORKSHOPS.length, label: "workshops taught" },
    ...(MEMBER_COUNT ? [{ value: MEMBER_COUNT, label: "members" }] : []),
  ];

  return (
    <>
      <NextEventHero event={next} />

      <Section className="py-8 sm:py-10">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
              <dd className="font-mono text-3xl font-bold text-gold">{s.value}</dd>
              <dt className="mt-1 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionHeading eyebrow="what we do" title="Learn by doing">
          Cybersecurity is a skill you pick up by trying things. That is what every session is built
          around.
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Card className="h-full">
                <Icon className="mb-3 size-6 text-brand-hover" aria-hidden="true" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {upcoming.length > 0 && (
        <Section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="coming up" title="Upcoming events" />
            <Link href="/events" className="mb-8 text-sm text-gold hover:underline">
              All events
            </Link>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {past.length > 0 && (
        <Section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="recently" title="What we have been up to" />
            <Link href="/past-events" className="mb-8 text-sm text-gold hover:underline">
              Past events
            </Link>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {past.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} showSignup={false} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <SectionHeading eyebrow="partners" title="Supported by" />
        {SPONSORS.length === 0 ? (
          <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted">
              Want to put your company in front of McMaster&apos;s next generation of security
              talent?
            </p>
            <ButtonLink href="/sponsors" variant="secondary">
              Become a sponsor
            </ButtonLink>
          </Card>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {SPONSORS.map((s) => (
              <li key={s.name} className="rounded-xl border border-border bg-surface px-6 py-4">
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section className="pb-4">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to try it?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Come to the next session, or try today&apos;s five-minute challenge right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/daily">Try the daily challenge</ButtonLink>
            <ButtonExternal href={LINKS.discord} variant="secondary">
              Join the Discord
            </ButtonExternal>
          </div>
        </div>
      </Section>
    </>
  );
}
