import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { CTF_RESULTS } from "@/data/ctf";
import { formatDate } from "@/lib/format";
import { Badge, Card, ExternalLink, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "CTF results",
  description: "Capture the Flag competitions McMaster Cyber Society has played, with results and writeups.",
};

export default function CtfPage() {
  const sorted = CTF_RESULTS.toSorted((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader eyebrow="cat ctf/results.log" title="CTF hall of fame">
        Every competition we have played, how we placed, and writeups so you can learn from them.
      </PageHeader>
      <Section>
        <ul className="grid gap-4 md:grid-cols-2">
          {sorted.map((ctf) => (
            <li key={ctf.slug}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{ctf.name}</h2>
                  <Badge tone="brand">{ctf.format}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{formatDate(`${ctf.date}T12:00:00-05:00`)}</p>

                <div className="mt-4 flex items-center gap-3">
                  <Trophy className="size-6 text-gold" aria-hidden="true" />
                  {ctf.rank && ctf.teams ? (
                    <p>
                      <span className="font-mono text-2xl font-bold text-gold">#{ctf.rank}</span>
                      <span className="text-muted"> of {ctf.teams} teams</span>
                    </p>
                  ) : (
                    <p className="text-muted">Results coming soon</p>
                  )}
                </div>

                {ctf.notes && <p className="mt-3 text-sm text-muted">{ctf.notes}</p>}

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {ctf.ctftimeUrl && (
                    <ExternalLink href={ctf.ctftimeUrl} className="text-gold hover:underline">
                      Scoreboard
                    </ExternalLink>
                  )}
                  {ctf.writeupUrl && (
                    <ExternalLink href={ctf.writeupUrl} className="text-gold hover:underline">
                      Writeups
                    </ExternalLink>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
