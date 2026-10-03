// Single source of truth for club-wide constants. Edit here, not in components.

export const SITE = {
  name: "McMaster Cyber Society",
  shortName: "Mac Cyber",
  tagline: "Learn to hack. Compete. Defend. No experience needed.",
  description:
    "McMaster University's student-run cybersecurity club: weekly CTF sessions, workshops, guest speakers and competitions for every skill level.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the final domain is known.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcmaster-cyber-society.vercel.app",
  email: "cybersoc@mcmaster.ca",
  timeZone: "America/Toronto",
} as const;

export interface SocialLink {
  label: string;
  href: string;
  description: string;
}

export const SOCIALS: readonly SocialLink[] = [
  {
    label: "Discord",
    href: "https://discord.gg/TCGaMGDVuA",
    description: "Chat, ask questions, find CTF teammates",
  },
  {
    label: "Bounce",
    href: "https://www.bouncelife.com/organizations/685c7166831541b7d83256ea",
    description: "Register for events",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/cybersociety.mcmaster",
    description: "Photos and announcements",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/mcmaster-cyber-society",
    description: "Follow us and connect with alumni",
  },
  {
    label: "GitHub",
    href: "https://github.com/McMaster-Cyber-Society",
    description: "Writeups, tools and this website",
  },
];

export const LINKS = {
  discord: SOCIALS[0].href,
  bounce: SOCIALS[1].href,
  github: SOCIALS[4].href,
  // Where project submissions land. Prefilled GitHub issue (no backend needed).
  projectSubmission: `${SOCIALS[4].href}/mcmaster-cyber-society/issues/new`,
} as const;

// Optional: fill in to show a members stat on the homepage.
export const MEMBER_COUNT: number | null = null;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: readonly NavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Start Here", href: "/start-here" },
  { label: "CTF", href: "/ctf" },
  { label: "Projects", href: "/projects" },
  { label: "Daily", href: "/daily" },
  { label: "About", href: "/about" },
];

export const FOOTER_NAV: readonly NavItem[] = [
  { label: "Past events", href: "/past-events" },
  { label: "Workshops", href: "/workshops" },
  { label: "Join", href: "/join" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Links", href: "/links" },
  { label: "Meet planner", href: "/meet" },
];
