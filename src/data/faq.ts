export interface Faq {
  q: string;
  a: string;
}

export const FAQ: readonly Faq[] = [
  {
    q: "Do I need any cybersecurity experience?",
    a: "No. Most of our members started with zero. Our weekly sessions are built so beginners can learn alongside experienced members.",
  },
  {
    q: "Do I need to be in a technical program?",
    a: "No. We welcome students from every faculty and year. Curiosity matters more than your major.",
  },
  {
    q: "What do I need to bring?",
    a: "A laptop is helpful for hands-on sessions. If you do not have one, pair up with someone. Nobody is turned away.",
  },
  {
    q: "Is it free?",
    a: "Yes. Joining and attending our events is free.",
  },
  {
    q: "Is hacking legal?",
    a: "We only practice on systems and challenges built for it, like CTFs and lab environments. We follow McMaster policy and the law, always.",
  },
  {
    q: "How do I stay updated?",
    a: "Join our Discord. Announcements, event reminders and CTF team-ups happen there first.",
  },
];
