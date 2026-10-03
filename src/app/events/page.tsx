import type { Metadata } from "next";
import { getUpcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { ButtonLink, Card, PageHeader, Section } from "@/components/ui";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming McMaster Cyber Society events. Sign up in one click.",
};

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  return (
    <>
      <PageHeader eyebrow="ls events/upcoming" title="Upcoming events">
        Sign up in one click. Every event is free and open to all McMaster students.
      </PageHeader>
      <Section>
        {upcoming.length === 0 ? (
          <Card>
            <p className="text-lg font-semibold">Nothing scheduled yet.</p>
            <p className="mt-2 text-muted">Check back soon or join our Discord for announcements.</p>
            <div className="mt-4">
              <ButtonLink href="/past-events" variant="secondary">
                See past events
              </ButtonLink>
            </div>
          </Card>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
