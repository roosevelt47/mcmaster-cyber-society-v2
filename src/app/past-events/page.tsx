import type { Metadata } from "next";
import { getPastEvents } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { PageHeader, Section } from "@/components/ui";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Past events",
  description: "A look back at what McMaster Cyber Society has done: CTFs, workshops and speakers.",
};

export default function PastEventsPage() {
  const past = getPastEvents();
  return (
    <>
      <PageHeader eyebrow="ls events/past" title="Past events">
        Workshops, competitions and speakers from earlier terms. Come to the next one.
      </PageHeader>
      <Section>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {past.map((e) => (
            <li key={e.slug}>
              <EventCard event={e} showSignup={false} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
