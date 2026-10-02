import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${item.href}` } : {}),
    })),
  };
  return (
    <>
      <nav className="breadcrumbs container" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span className="breadcrumb-item" key={`${item.label}-${index}`}>
            {index > 0 ? <ChevronRight size={13} aria-hidden="true" /> : null}
            {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
