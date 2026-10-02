import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section section--paper">
      <div className="container">
        <div className="empty-state not-found-state">
          <span className="empty-state-icon"><Search size={18} aria-hidden="true" /></span>
          <p className="eyebrow">404 / ROUTE NOT FOUND</p>
          <h1>That road doesn’t lead anywhere.</h1>
          <p>The page may have moved, or the vehicle listing is no longer published. Explore current services or ask the team for help.</p>
          <Link href="/" className="button button--secondary"><ArrowLeft size={16} aria-hidden="true" />Back to Olasco Autos</Link>
        </div>
      </div>
    </section>
  );
}
