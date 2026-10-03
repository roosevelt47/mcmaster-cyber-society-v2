import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { EVENT_TYPE_LABEL, type ClubEvent, type EventType } from "@/data/events";
import { formatDate, formatTimeRange, isMultiDay } from "@/lib/format";
import { Badge, ExternalLink, buttonClass } from "@/components/ui";

const TYPE_TONE: Readonly<Record<EventType, "brand" | "gold" | "mint" | "neutral">> = {
  ctf: "brand",
  workshop: "mint",
  social: "gold",
  speaker: "gold",
  meeting: "neutral",
};

export function EventCard({ event, showSignup = true }: { event: ClubEvent; showSignup?: boolean }) {
  const multiDay = isMultiDay(event.start, event.end);
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-muted">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Badge tone={TYPE_TONE[event.type]}>{EVENT_TYPE_LABEL[event.type]}</Badge>
      </div>
      <h3 className="text-lg font-semibold leading-snug">
        <Link href={`/events/${event.slug}`} className="hover:text-gold">
          {event.title}
        </Link>
      </h3>
      <dl className="mt-3 space-y-1.5 text-sm text-muted">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">When</dt>
          <dd>
            {multiDay
              ? `${formatDate(event.start)} – ${formatDate(event.end ?? event.start)}`
              : `${formatDate(event.start)} · ${formatTimeRange(event.start, event.end)}`}
          </dd>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Where</dt>
            <dd>{event.location}</dd>
          </div>
        )}
      </dl>
      <p className="mt-3 flex-1 text-sm text-muted">{event.description}</p>
      {showSignup && event.signupUrl && (
        <ExternalLink
          href={event.signupUrl}
          className={buttonClass("primary", "mt-4 w-full")}
          aria-label={`Sign up for ${event.title}`}
        >
          Sign up
        </ExternalLink>
      )}
    </article>
  );
}
