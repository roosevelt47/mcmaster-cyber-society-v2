// "New to cyber?" roadmap. Verify links before launch; sites change.

export interface Resource {
  name: string;
  href: string;
  blurb: string;
  free: "free" | "freemium" | "paid";
}

export interface RoadmapStage {
  id: string;
  title: string;
  goal: string;
  resources: readonly Resource[];
}

export const ROADMAP: readonly RoadmapStage[] = [
  {
    id: "foundations",
    title: "1. Foundations",
    goal: "Get comfortable in a Linux terminal and understand how the internet works.",
    resources: [
      {
        name: "Linux Journey",
        href: "https://linuxjourney.com",
        blurb: "Bite-sized Linux lessons from zero. Do the Grasshopper section first.",
        free: "free",
      },
      {
        name: "OverTheWire: Bandit",
        href: "https://overthewire.org/wargames/bandit/",
        blurb: "A game that teaches the Linux command line, one password at a time.",
        free: "free",
      },
      {
        name: "TryHackMe: Pre Security",
        href: "https://tryhackme.com",
        blurb: "Guided rooms covering networking, web and Linux fundamentals.",
        free: "freemium",
      },
    ],
  },
  {
    id: "first-ctfs",
    title: "2. Your first CTFs",
    goal: "Solve beginner challenges and learn the common categories.",
    resources: [
      {
        name: "picoCTF",
        href: "https://picoctf.org",
        blurb: "Made for beginners. The picoGym has hundreds of practice challenges.",
        free: "free",
      },
      {
        name: "CTF 101",
        href: "https://ctf101.org",
        blurb: "Plain-English guide to what CTFs are and the main challenge types.",
        free: "free",
      },
      {
        name: "CyberChef",
        href: "https://gchq.github.io/CyberChef/",
        blurb: "The Swiss Army knife for decoding and transforming data.",
        free: "free",
      },
    ],
  },
  {
    id: "skills",
    title: "3. Build real skills",
    goal: "Go deeper with structured paths and realistic machines.",
    resources: [
      {
        name: "Hack The Box Academy",
        href: "https://academy.hackthebox.com",
        blurb: "Structured modules with hands-on labs. Start with the free tier.",
        free: "freemium",
      },
      {
        name: "TryHackMe learning paths",
        href: "https://tryhackme.com/paths",
        blurb: "Jr Penetration Tester and SOC Level 1 paths are popular next steps.",
        free: "freemium",
      },
      {
        name: "Rogers Cybersecure Catalyst",
        href: "https://www.cybersecurecatalyst.ca",
        blurb: "Canadian cybersecurity training and community programs.",
        free: "freemium",
      },
    ],
  },
  {
    id: "watch",
    title: "Watch and listen",
    goal: "Learn by watching people work through real challenges.",
    resources: [
      {
        name: "John Hammond (YouTube)",
        href: "https://www.youtube.com/@_JohnHammond",
        blurb: "CTF walkthroughs and malware analysis, beginner friendly.",
        free: "free",
      },
      {
        name: "LiveOverflow (YouTube)",
        href: "https://www.youtube.com/@LiveOverflow",
        blurb: "Clear explanations of how exploits actually work.",
        free: "free",
      },
      {
        name: "IppSec (YouTube)",
        href: "https://www.youtube.com/@ippsec",
        blurb: "Hack The Box machine walkthroughs. Great for learning methodology.",
        free: "free",
      },
    ],
  },
];
