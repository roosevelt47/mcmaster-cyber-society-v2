// Club events. TO ADD AN EVENT: append an object and open a PR.
// - `start`/`end` are ISO 8601 WITH offset (Toronto: -05:00 winter, -04:00 summer).
// - Upcoming vs past is computed automatically from `start`/`end`.
// - Entries marked SAMPLE are placeholders: replace them with real events.

export type EventType = "ctf" | "workshop" | "social" | "speaker" | "meeting";

export interface ClubEvent {
  slug: string;
  title: string;
  start: string;
  end?: string;
  location?: string;
  type: EventType;
  description: string;
  /** Where students register (Bounce, Google Form, CTFtime...). */
  signupUrl?: string;
  /** Short wrap-up shown on past events. */
  recap?: string;
  attendance?: number;
  /** Paths under /public, e.g. "/events/kickoff-1.jpg". */
  photos?: readonly string[];
}

const BOUNCE = "https://www.bouncelife.com/organizations/685c7166831541b7d83256ea";

export const EVENTS: readonly ClubEvent[] = [
  // ---- Upcoming (SAMPLE: replace with real dates) ----
  {
    slug: "cyberweekly-2026-10-14",
    title: "CyberWeekly: Intro CTF Night",
    start: "2026-10-14T18:00:00-04:00",
    end: "2026-10-14T19:00:00-04:00",
    location: "ETB 228",
    type: "workshop",
    description:
      "Our weekly hands-on session. Solve beginner-friendly Capture the Flag challenges with the club. Bring a laptop; no experience needed.",
    signupUrl: BOUNCE,
  },
  {
    slug: "cyberweekly-2026-10-21",
    title: "CyberWeekly: Web Exploitation Basics",
    start: "2026-10-21T18:00:00-04:00",
    end: "2026-10-21T19:00:00-04:00",
    location: "ETB 228",
    type: "workshop",
    description:
      "Cookies, sessions, SQL injection and XSS, taught from scratch on deliberately vulnerable practice apps.",
    signupUrl: BOUNCE,
  },
  {
    slug: "guest-speaker-2026-11-04",
    title: "Guest Speaker: Careers in Security",
    start: "2026-11-04T18:00:00-05:00",
    end: "2026-11-04T19:30:00-05:00",
    location: "ETB 237",
    type: "speaker",
    description:
      "An industry professional shares how they broke into security and what the day-to-day looks like.",
    signupUrl: BOUNCE,
  },

  // ---- Past ----
  {
    slug: "guest-speaker-industry-practices",
    title: "Guest Speaker: Industry Security Practices",
    start: "2025-09-08T18:00:00-04:00",
    end: "2025-09-08T19:30:00-04:00",
    location: "ETB 237",
    type: "speaker",
    description:
      "An industry professional shared insights on real-world security practices and career paths.",
  },
  {
    slug: "kickoff-meeting-2025",
    title: "Kickoff Meeting & Introduction to Cybersecurity",
    start: "2025-10-01T18:00:00-04:00",
    end: "2025-10-01T19:00:00-04:00",
    location: "ETB 237",
    type: "meeting",
    description:
      "Our first event: meet the team, learn about our goals, and get an introduction to the world of cybersecurity.",
  },
  {
    slug: "securinets-ctf-quals-2025",
    title: "Securinets CTF Quals 2025",
    start: "2025-10-04T00:00:00-04:00",
    end: "2025-10-05T23:59:00-04:00",
    type: "ctf",
    description:
      "A global cybersecurity competition spanning diverse challenge categories. We competed as a club team.",
  },
  {
    slug: "first-cyberweekly-2025",
    title: "First-Ever CyberWeekly",
    start: "2025-10-29T18:00:00-04:00",
    end: "2025-10-29T19:00:00-04:00",
    location: "BSB B142",
    type: "workshop",
    description:
      "Our first CyberWeekly session: solving fun Capture the Flag challenges together, hands-on.",
  },
  {
    slug: "v1t-ctf-2025",
    title: "V1T CTF 2025",
    start: "2025-10-31T00:00:00-04:00",
    end: "2025-11-02T23:59:00-05:00",
    type: "ctf",
    description:
      "A beginner-friendly and intermediate Capture The Flag competition organized by V1t.",
  },
];

export const EVENT_TYPE_LABEL: Readonly<Record<EventType, string>> = {
  ctf: "CTF",
  workshop: "Workshop",
  social: "Social",
  speaker: "Speaker",
  meeting: "Meeting",
};
