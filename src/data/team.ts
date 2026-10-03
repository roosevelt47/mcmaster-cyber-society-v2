// Executive team. Replace "Position Open" entries with real people.

export interface TeamMember {
  name: string;
  role: string;
  blurb: string;
  linkedinUrl?: string;
}

export const TEAM: readonly TeamMember[] = [
  { name: "Position Open", role: "President", blurb: "Club leadership and vision" },
  { name: "Position Open", role: "Vice President", blurb: "Operations and coordination" },
  { name: "Position Open", role: "Technical Lead", blurb: "Workshops and CTF events" },
  { name: "Position Open", role: "Events Coordinator", blurb: "Event planning and logistics" },
];
