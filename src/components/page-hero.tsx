import type { ReactNode } from "react";
import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  dark = false,
  image,
  imageAlt,
  imagePriority = true,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
  dark?: boolean;
  /** Optional sharp photography for the right-hand column. */
  image?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero${dark ? " page-hero--dark" : ""}${image ? " page-hero--media" : ""}`}>
      <div className="container page-hero-inner">
        <div className="page-hero-lead">
          <p className={`eyebrow${dark ? " eyebrow--lime" : ""}`}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-copy">{description}</p>
          {children}
          {image && aside ? <p className="page-hero-footnote">{aside}</p> : null}
        </div>
        {image ? (
          <figure className="page-hero-media">
            <Image
              src={image}
              alt={imageAlt || ""}
              fill
              priority={imagePriority}
              quality={90}
              sizes="(max-width: 980px) 94vw, 46vw"
            />
          </figure>
        ) : aside ? (
          <div className="page-hero-aside">{aside}</div>
        ) : null}
      </div>
    </section>
  );
}
