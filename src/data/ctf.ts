// CTF results. TO ADD ONE: append an object and open a PR.
// Fill `rank`/`teams` once the final scoreboard is published. Leave undefined until then.

export interface CtfResult {
  slug: string;
  name: string;
  /** ISO date (YYYY-MM-DD) the competition started. */
  date: string;
  format: "online" | "in-person";
  /** Final placement of the club team (overall). */
  rank?: number;
  /** Total number of teams that scored. */
  teams?: number;
  /** Number of club members who played. */
  players?: number;
  ctftimeUrl?: string;
  writeupUrl?: string;
  scoreboardImage?: string;
  notes?: string;
}

export const CTF_RESULTS: readonly CtfResult[] = [
  {
    slug: "v1t-ctf-2025",
    name: "V1T CTF 2025",
    date: "2025-10-31",
    format: "online",
    notes: "Beginner/intermediate CTF. Results and writeups coming soon.",
  },
  {
    slug: "securinets-ctf-quals-2025",
    name: "Securinets CTF Quals 2025",
    date: "2025-10-04",
    format: "online",
    notes: "Our first competition as a club. Results and writeups coming soon.",
  },
];
