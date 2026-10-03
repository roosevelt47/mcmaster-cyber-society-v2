import { EVENTS } from "@/data/events";
import { buildIcs } from "@/lib/calendar";
import { getEventBySlug } from "@/lib/events";

export function generateStaticParams(): { slug: string }[] {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/events/[slug]/calendar.ics">,
): Promise<Response> {
  const { slug } = await ctx.params;
  const event = getEventBySlug(slug);
  if (!event) return new Response("Not found", { status: 404 });

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
