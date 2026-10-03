import type { Metadata } from "next";
import { WORKSHOPS } from "@/data/workshops";
import { formatDate } from "@/lib/format";
import { Badge, Card, ExternalLink, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Past McMaster Cyber Society workshops with slides and recordings.",
};

export default function WorkshopsPage() {
  const sorted = WORKSHOPS.toSorted((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader eyebrow="ls workshops/" title="Workshops">
        Everything we have taught, with slides and recordings so you can catch up any time.
      </PageHeader>
      <Section>
        <ul className="grid gap-4 md:grid-cols-2">
          {sorted.map((w) => (
            <li key={w.slug}>
              <Card className="h-full">
                <div className="flex items-center gap-2">
                  <Badge tone="mint">{w.level}</Badge>
                  <span className="text-sm text-muted">{formatDate(`${w.date}T12:00:00-05:00`)}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold">{w.title}</h2>
                <p className="mt-2 text-sm text-muted">{w.summary}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {w.topics.map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                </ul>
                {(w.slidesUrl || w.recordingUrl) && (
                  <div className="mt-4 flex gap-4 text-sm">
                    {w.slidesUrl && (
                      <ExternalLink href={w.slidesUrl} className="text-gold hover:underline">
                        Slides
                      </ExternalLink>
                    )}
                    {w.recordingUrl && (
                      <ExternalLink href={w.recordingUrl} className="text-gold hover:underline">
                        Recording
                      </ExternalLink>
                    )}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
