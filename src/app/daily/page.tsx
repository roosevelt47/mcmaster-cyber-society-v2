import type { Metadata } from "next";
import { DailyChallenge } from "@/components/DailyChallenge";
import { PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Daily challenge",
  description: "A new beginner cybersecurity puzzle every day. Build a streak and learn the basics.",
};

export default function DailyPage() {
  return (
    <>
      <PageHeader eyebrow="./daily --new" title="Daily challenge">
        One small beginner puzzle every day. Decode it, build a streak, learn the tricks CTFs use.
      </PageHeader>
      <Section>
        <DailyChallenge />
      </Section>
    </>
  );
}
