"use client";

import { useCallback, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface CarRailItem {
  name: string;
  meta: string;
  /** Rendered price, or an honest fallback such as "Quote on request". */
  price: string;
  /** Unit shown after the price, e.g. "/day". Omit when the price is a quote. */
  unit?: string;
  href: string;
  image: string;
  alt: string;
}

/**
 * Horizontal fleet rail with the circular prev/next controls from the
 * reference design. Falls back to native scrolling on touch devices.
 */
export function CarRail({
  eyebrow,
  title,
  description,
  action,
  items,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  action?: ReactNode;
  items: readonly CarRailItem[];
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(rail.clientWidth * 0.8, 260);
    rail.scrollBy({ left: amount * direction, behavior: "smooth" });
  }, []);

  return (
    <div className="car-rail-section">
      <div className="car-rail-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="section-heading-description">{description}</p>
          {action}
        </div>
        <div className="rail-controls">
          <button type="button" className="rail-button" onClick={() => scrollBy(-1)} aria-label="Show previous vehicles">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="rail-button" onClick={() => scrollBy(1)} aria-label="Show more vehicles">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="car-rail" ref={railRef} tabIndex={0} role="region" aria-label="Popular rental classes">
        {items.map((item) => (
          <article className="car-card" key={item.href + item.name}>
            <Link className="car-card-media" href={item.href} aria-label={`${item.name} — ${item.meta}`} tabIndex={-1}>
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 78vw, 300px" quality={90} />
            </Link>
            <div className="car-card-body">
              <div>
                <span className="car-card-name">{item.name}</span>
                <span className="car-card-meta">{item.meta}</span>
                <span className="car-card-price">
                  {item.price}
                  {item.unit ? <small> {item.unit}</small> : null}
                </span>
              </div>
              <Link className="card-arrow" href={item.href} aria-label={`Request ${item.name}`}>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
