import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  dark = false,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero${dark ? " page-hero--dark" : ""}`}>
      <div className="container page-hero-inner">
        <div>
          <p className={`eyebrow${dark ? " eyebrow--lime" : ""}`}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-copy">{description}</p>
          {children}
        </div>
        {aside ? <div className="page-hero-aside">{aside}</div> : null}
      </div>
    </section>
  );
}
