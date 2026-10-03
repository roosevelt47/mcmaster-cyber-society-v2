import type { MetadataRoute } from "next";
import { EVENTS } from "@/data/events";
import { SITE } from "@/data/site";

const STATIC_PATHS = [
  "",
  "/events",
  "/past-events",
  "/ctf",
  "/workshops",
  "/projects",
  "/about",
  "/join",
  "/start-here",
  "/sponsors",
  "/links",
  "/daily",
  "/meet",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC_PATHS.map((path) => ({ url: `${SITE.url}${path}` }));
  const events = EVENTS.map((e) => ({ url: `${SITE.url}/events/${e.slug}` }));
  return [...pages, ...events];
}
