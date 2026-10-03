import type { Metadata } from "next";
import { MeetPlanner } from "@/components/meet/MeetPlanner";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Meet planner",
  description: "Find a time that works for your whole team. A private When2meet alternative with no accounts.",
  // Poll links are private to whoever has them.
  robots: { index: true, follow: true },
};

export default function MeetPage() {
  return (
    <>
      <PageHeader eyebrow="./meet --find-time" title="Meet planner">
        Find a time that works for everyone. Great for CTF teams and study groups. No accounts, and
        your answers never touch a server.
      </PageHeader>
      <Section>
        <MeetPlanner />
      </Section>
    </>
  );
}
