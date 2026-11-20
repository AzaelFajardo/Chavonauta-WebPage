import type { MetadataRoute } from "next";
import { repository } from "@/lib/data/repository";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items] = await Promise.all([repository.getCatalogItems()]);
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/catalogo", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...items.map((item) => ({
      url: new URL(`/item/${item.slug}`, siteUrl).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
