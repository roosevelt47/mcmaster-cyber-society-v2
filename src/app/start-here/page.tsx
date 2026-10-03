import type { Metadata } from "next";
import { ROADMAP } from "@/data/resources";
import { Badge, ButtonLink, Card, ExternalLink, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Start here",
  description: "New to cybersecurity? A beginner roadmap: Linux, picoCTF, TryHackMe, Hack The Box and more.",
};

export default function StartHerePage() {
  return (
    <>
      <PageHeader eyebrow="cat roadmap.md" title="New to cyber? Start here">
        A simple path from zero to your first CTF. Follow the stages in order, or jump to what
        interests you. Everything marked free is free.
      </PageHeader>

      <Section className="space-y-12">
        {ROADMAP.map((stage) => (
          <div key={stage.id}>
            <h2 className="text-xl font-bold sm:text-2xl">{stage.title}</h2>
            <p className="mt-1 text-muted">{stage.goal}</p>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {stage.resources.map((r) => (
                <li key={r.name}>
                  <Card className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">
                        <ExternalLink href={r.href} className="hover:text-gold">
                          {r.name}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </ExternalLink>
                      </h3>
                      <Badge tone={r.free === "free" ? "mint" : "gold"}>{r.free}</Badge>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-muted">{r.blurb}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Ready for a warm-up?</h2>
            <p className="mt-1 text-sm text-muted">One small beginner puzzle every day.</p>
          </div>
          <ButtonLink href="/daily">Try today&apos;s challenge</ButtonLink>
        </Card>
      </Section>
    </>
  );
}
