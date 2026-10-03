// Past workshops and learning material. Add `slidesUrl`/`recordingUrl` as they become available.

export interface Workshop {
  slug: string;
  title: string;
  /** ISO date YYYY-MM-DD. */
  date: string;
  summary: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: readonly string[];
  slidesUrl?: string;
  recordingUrl?: string;
}

export const WORKSHOPS: readonly Workshop[] = [
  {
    slug: "first-cyberweekly",
    title: "CyberWeekly #1: Intro CTF Night",
    date: "2025-10-29",
    summary:
      "How a Capture the Flag works, how to read a challenge, and your first flags together with the club.",
    level: "beginner",
    topics: ["CTF basics", "Encoding", "Teamwork"],
  },
  {
    slug: "kickoff-intro",
    title: "Introduction to Cybersecurity",
    date: "2025-10-01",
    summary:
      "What cybersecurity is, the main career paths, and how to start learning without any background.",
    level: "beginner",
    topics: ["Careers", "Roadmap", "Mindset"],
  },
];
