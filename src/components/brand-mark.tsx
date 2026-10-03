import Link from "next/link";

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-lockup${inverted ? " brand-lockup--light" : ""}`} href="/" aria-label="Olasco Autos home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 64 42" focusable="false">
          <path
            d="m7.5 27.5 3.2-8.3a4.4 4.4 0 0 1 2.8-2.7l5.1-1.7 4.4-6.7a3.4 3.4 0 0 1 2.8-1.5h16.4a3.4 3.4 0 0 1 2.8 1.5l4.4 6.7 5.1 1.7a4.4 4.4 0 0 1 2.8 2.7l3.2 8.3v4.4H7.5z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2.7"
          />
          <path d="m19 15.7 4.6-7h17l4.6 7" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.2" />
          <path d="M10 26.7h44" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="32" y="25.2" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.7" textAnchor="middle">
            OA
          </text>
          <circle cx="18" cy="32.1" r="4.3" fill="var(--ink)" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="46" cy="32.1" r="4.3" fill="var(--ink)" stroke="currentColor" strokeWidth="2.4" />
        </svg>
      </span>
      <span className="brand-wordmark">
        <strong>OLASCO</strong>
        <small>AUTOS</small>
      </span>
    </Link>
  );
}
