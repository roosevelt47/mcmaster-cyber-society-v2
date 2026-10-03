// Sponsors and sponsorship tiers. DRAFT: the exec team must confirm tiers and amounts.

export interface Sponsor {
  name: string;
  href: string;
  /** Path under /public, e.g. "/sponsors/acme.svg". */
  logo?: string;
}

/** Add sponsors here once they confirm. An empty list shows a "become a sponsor" call to action. */
export const SPONSORS: readonly Sponsor[] = [];

export interface SponsorTier {
  name: string;
  amount: string;
  perks: readonly string[];
}

export const TIERS: readonly SponsorTier[] = [
  {
    name: "Supporter",
    amount: "To be confirmed",
    perks: [
      "Logo on the website sponsors page",
      "Shout-out on Discord and Instagram",
      "Thank-you slide at club events",
    ],
  },
  {
    name: "Partner",
    amount: "To be confirmed",
    perks: [
      "Everything in Supporter",
      "Logo on the homepage",
      "Job and internship posts shared with members",
      "Table or booth at one club event",
    ],
  },
  {
    name: "Headline",
    amount: "To be confirmed",
    perks: [
      "Everything in Partner",
      "Named workshop or CTF night",
      "Speaker slot to present to members",
      "Early access to our member resume book",
    ],
  },
];
