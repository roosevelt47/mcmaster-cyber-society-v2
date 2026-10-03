// Project showcase. Students can submit projects via the GitHub issue form linked on /projects.
// Accepted submissions get added here by an exec in a PR.

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  repoUrl: string;
  author: string;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "club-website",
    title: "This website",
    summary:
      "The club website you are on right now. Open source, built by club members with Next.js. Come help build it.",
    tags: ["Next.js", "TypeScript", "Web"],
    repoUrl: "https://github.com/McMaster-Cyber-Society/mcmaster-cyber-society",
    author: "Web team",
  },
  {
    slug: "ctf-writeups",
    title: "CTF writeups",
    summary:
      "Writeups from the competitions we play. Learn how each challenge was solved, step by step.",
    tags: ["CTF", "Writeups"],
    repoUrl: "https://github.com/McMaster-Cyber-Society",
    author: "CTF team",
  },
];
