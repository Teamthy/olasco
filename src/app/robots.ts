import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${businessConfig.publicUrl}/sitemap.xml`,
  };
}
