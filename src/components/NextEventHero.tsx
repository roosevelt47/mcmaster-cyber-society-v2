import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import type { ClubEvent } from "@/data/events";
import { EVENT_TYPE_LABEL } from "@/data/events";
import { LINKS, SITE } from "@/data/site";
import { formatLongDate, formatTimeRange } from "@/lib/format";
import { Badge, ButtonExternal, ButtonLink } from "@/components/ui";
import { Countdown } from "@/components/Countdown";

/** First thing visitors see: the next event with a one-click sign up. */
export function NextEventHero({ event }: { event: ClubEvent | null }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="glow-brand absolute left-1/2 top-0 h-96 w-[48rem] -translate-x-1/2"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-sm text-mint">
            $ whoami<span className="cursor-blink">_</span>
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            {SITE.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonExternal href={LINKS.discord}>Join the Discord</ButtonExternal>
            <ButtonLink href="/start-here" variant="secondary">
              New to cyber? Start here
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-2xl border border-brand/50 bg-surface/90 p-6 shadow-2xl shadow-brand/10">
          {event ? <EventPanel event={event} /> : <NoEventPanel />}
        </div>
      </div>
    </section>
  );
}

function EventPanel({ event }: { event: ClubEvent }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Badge tone="gold">Next event</Badge>
        <Badge>{EVENT_TYPE_LABEL[event.type]}</Badge>
      </div>
      <h2 className="mt-4 text-2xl font-bold leading-tight">
        <Link href={`/events/${event.slug}`} className="hover:text-gold">
          {event.title}
        </Link>
      </h2>
      <dl className="mt-4 space-y-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4" aria-hidden="true" />
          <dt className="sr-only">Date</dt>
          <dd>{formatLongDate(event.start)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden="true" />
          <dt className="sr-only">Time</dt>
          <dd>{formatTimeRange(event.start, event.end)}</dd>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd>{event.location}</dd>
          </div>
        )}
      </dl>
      <div className="mt-5">
        <Countdown targetIso={event.start} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {event.signupUrl && (
          <ButtonExternal href={event.signupUrl} className="flex-1 sm:flex-none">
            Sign up now
          </ButtonExternal>
        )}
        <ButtonLink href={`/events/${event.slug}`} variant="secondary">
          Details
        </ButtonLink>
      </div>
    </>
  );
}

function NoEventPanel() {
  return (
    <>
      <Badge tone="gold">Next event</Badge>
      <h2 className="mt-4 text-2xl font-bold">New events are on the way</h2>
      <p className="mt-2 text-muted">
        We have nothing scheduled right now. Join the Discord to hear first.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonExternal href={LINKS.discord}>Join the Discord</ButtonExternal>
        <ButtonLink href="/past-events" variant="secondary">
          See past events
        </ButtonLink>
      </div>
    </>
  );
}
