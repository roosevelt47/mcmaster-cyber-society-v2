import type { Metadata } from "next";
import { LINKS } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import { Badge, ButtonExternal, Card, ExternalLink, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built by McMaster Cyber Society members. Submit yours.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="git log --projects" title="Project showcase">
        Tools, writeups and experiments from members. Built something? Show it off.
      </PageHeader>
      <Section>
        <ul className="grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              <Card className="flex h-full flex-col">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">by {p.author}</p>
                <p className="mt-3 flex-1 text-sm text-muted">{p.summary}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                </ul>
                <ExternalLink href={p.repoUrl} className="mt-4 text-sm text-gold hover:underline">
                  View on GitHub
                </ExternalLink>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Submit your project</h2>
            <p className="mt-1 text-sm text-muted">
              Open an issue with a title, a short description and your repo link. An exec reviews it
              and adds it here.
            </p>
          </div>
          <ButtonExternal href={LINKS.projectSubmission}>Submit on GitHub</ButtonExternal>
        </Card>
      </Section>
    </>
  );
}
