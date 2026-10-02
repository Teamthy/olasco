import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ServiceCard({
  eyebrow,
  title,
  description,
  href,
  action,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  icon: ReactNode;
}) {
  return (
    <Link href={href} className="service-selector-card">
      <div className="service-selector-top"><span className="eyebrow">{eyebrow}</span><span className="service-card-icon" aria-hidden="true">{icon}</span></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <ArrowUpRight className="service-card-arrow" size={18} aria-hidden="true" />
      <span className="visually-hidden">{action}</span>
    </Link>
  );
}

export function VehicleClassCard({
  name,
  description,
  href,
  image,
  alt,
  label,
}: {
  name: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  label: string;
}) {
  return (
    <article className="class-card">
      <Link className="class-card-media" href={href} aria-label={`Explore ${name}`}>
        <Image src={image} alt={alt} fill sizes="(max-width: 640px) 40vw, (max-width: 900px) 45vw, 30vw"
          quality={90} />
        <span className="class-card-photo-note">Fleet photography</span>
      </Link>
      <div className="class-card-body">
        <p className="eyebrow">{label}</p>
        <h3>{name}</h3>
        <p>{description}</p>
        <Link className="class-card-link" href={href}>Request availability<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
