import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { EVENTS, EVENT_TYPE_LABEL } from "@/data/events";
import { googleCalendarUrl } from "@/lib/calendar";
import { getEventBySlug, isPastEvent } from "@/lib/events";
import { formatLongDate, formatTimeRange, isMultiDay } from "@/lib/format";
import { Badge, ButtonExternal, ButtonLink, Section } from "@/components/ui";

export const revalidate = 3600;

export function generateStaticParams(): { slug: string }[] {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const isPast = isPastEvent(event);
  const multiDay = isMultiDay(event.start, event.end);

  return (
    <Section className="max-w-3xl">
      <Link href={isPast ? "/past-events" : "/events"} className="text-sm text-muted hover:text-foreground">
        ← Back to {isPast ? "past events" : "events"}
      </Link>
      <div className="mt-6 flex items-center gap-2">
        <Badge tone="gold">{EVENT_TYPE_LABEL[event.type]}</Badge>
        {isPast && <Badge>Past event</Badge>}
      </div>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>

      <dl className="mt-5 space-y-2 text-muted">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5" aria-hidden="true" />
          <dt className="sr-only">When</dt>
          <dd>
            {formatLongDate(event.start)}
            {multiDay
              ? ` – ${formatLongDate(event.end ?? event.start)}`
              : `, ${formatTimeRange(event.start, event.end)}`}
          </dd>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-5" aria-hidden="true" />
            <dt className="sr-only">Where</dt>
            <dd>{event.location}</dd>
          </div>
        )}
      </dl>

      <p className="mt-6 text-lg leading-relaxed">{event.description}</p>
      {event.recap && <p className="mt-4 text-muted">{event.recap}</p>}

      {!isPast && (
        <div className="mt-8 flex flex-wrap gap-3">
          {event.signupUrl && <ButtonExternal href={event.signupUrl}>Sign up</ButtonExternal>}
          <ButtonExternal href={googleCalendarUrl(event)} variant="secondary">
            Add to Google Calendar
          </ButtonExternal>
          <ButtonLink href={`/events/${event.slug}/calendar.ics`} variant="secondary">
            Download .ics
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}
