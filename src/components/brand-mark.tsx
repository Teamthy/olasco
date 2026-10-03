import Link from "next/link";

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-lockup${inverted ? " brand-lockup--light" : ""}`} href="/" aria-label="Olasco Autos home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 52 48" focusable="false">
          <path
            d="M4.5 41 20.6 9.7c1-1.9 2.5-2.9 4.8-2.9s3.8 1 4.8 2.9L46.5 41h-9.4L25.4 19.3 13.8 41H4.5Z"
            fill="currentColor"
          />
          <path
            d="M18.5 31.5h13.8m0 0-4.6-3.2m4.6 3.2-4.6 3.2"
            fill="none"
            stroke="var(--ink)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      </span>
      <span className="brand-wordmark">
        <strong>OLASCO</strong>
        <small>AUTOS</small>
      </span>
    </Link>
  );
}
