import type { MetadataRoute } from "next";

const SITE_URL = "https://katibim.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/insights/",
          "/profile/",
          "/dashboard/",
          "/results/",
        ],
      },
      // AI crawlers — allow them to index public content for GEO
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/insights/", "/profile/", "/dashboard/", "/results/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/auth/", "/insights/", "/profile/", "/dashboard/", "/results/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
