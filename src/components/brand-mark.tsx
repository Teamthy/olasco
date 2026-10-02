import Link from "next/link";

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-lockup${inverted ? " brand-lockup--light" : ""}`} href="/" aria-label="Olasco Autos home">
      <span className="brand-symbol" aria-hidden="true">
        <span>O</span><span>A</span>
      </span>
      <span className="brand-wordmark">
        <strong>OLASCO</strong>
        <small>AUTOS</small>
      </span>
    </Link>
  );
}
