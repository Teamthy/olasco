import Link from "next/link";

function OlascoEmblem({ size = 96 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="olasco-mark-gold" gradientUnits="userSpaceOnUse" x1="8" y1="4" x2="88" y2="92">
          <stop offset="0" stopColor="#F6E3A6" />
          <stop offset="0.28" stopColor="#DFB95C" />
          <stop offset="0.55" stopColor="#B98A2E" />
          <stop offset="0.78" stopColor="#E8C878" />
          <stop offset="1" stopColor="#A2761F" />
        </linearGradient>
        <radialGradient id="olasco-mark-field" cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor="#17242f" />
          <stop offset="1" stopColor="#0b1117" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="45.6" fill="url(#olasco-mark-field)" />
      <circle cx="48" cy="48" r="43.6" fill="none" stroke="url(#olasco-mark-gold)" strokeWidth="2.8" />
      <circle cx="48" cy="48" r="38.6" fill="none" stroke="url(#olasco-mark-gold)" strokeWidth="0.8" opacity="0.6" />
      <g stroke="url(#olasco-mark-gold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.65">
        {Array.from({ length: 12 }, (_, index) => (
          <line
            key={index}
            x1="48"
            y1="12"
            x2="48"
            y2="16"
            transform={`rotate(${index * 30} 48 48)`}
          />
        ))}
      </g>
      <path
        d="M19.8 57.2 C19.8 53.9 21.4 51.8 24.2 50.9 L31.2 49 C33.4 45.1 37.2 42.7 41.9 42.3 L55.6 42.3 C60 42.6 63.5 44.3 66.1 47.2 L71.3 49.1 C73.9 50.1 74.9 52.2 74.9 54.6 L74.9 57.2 L70 57.2 A5.7 5.7 0 0 0 58.6 57.2 L38.2 57.2 A5.7 5.7 0 0 0 26.8 57.2 Z"
        fill="url(#olasco-mark-gold)"
      />
      <path d="M35.4 48.2 L41.3 44.4 L49.6 44.4 L49.6 48.2 Z" fill="#0b1117" />
      <path d="M52.4 44.4 L54.4 44.4 C57.4 44.7 59.8 45.8 61.8 48.2 L52.4 48.2 Z" fill="#0b1117" />
      <circle cx="32.4" cy="57.2" r="5.7" fill="url(#olasco-mark-gold)" />
      <circle cx="32.4" cy="57.2" r="2.1" fill="#0b1117" />
      <circle cx="64.3" cy="57.2" r="5.7" fill="url(#olasco-mark-gold)" />
      <circle cx="64.3" cy="57.2" r="2.1" fill="#0b1117" />
      <path d="M23.5 66.4 L71.3 66.4" stroke="url(#olasco-mark-gold)" strokeWidth="1.9" strokeLinecap="round" opacity="0.6" />
      <path d="M14.5 51.5 C15.9 54.7 15.9 58.2 14.7 61.4" stroke="url(#olasco-mark-gold)" strokeWidth="1.9" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M81.5 51.5 C80.1 54.7 80.1 58.2 81.3 61.4" stroke="url(#olasco-mark-gold)" strokeWidth="1.9" strokeLinecap="round" fill="none" opacity="0.55" />
    </svg>
  );
}

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-lockup${inverted ? " brand-lockup--light" : ""}`} href="/" aria-label="Olasco Autos home">
      <span className="brand-symbol" aria-hidden="true">
        <OlascoEmblem />
      </span>
      <span className="brand-wordmark">
        <strong>OLASCO</strong>
        <small>AUTOS</small>
      </span>
    </Link>
  );
}
