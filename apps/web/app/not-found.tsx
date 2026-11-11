import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-width error-shell">
      <span className="eyebrow">Not found</span>
      <h1>That page wandered<br /><em>off the map.</em></h1>
      <p>The link may be old, or the resource may have moved. Head back to the library to find another option.</p>
      <Link href="/resources" className="button button-dark">Explore resources <span aria-hidden="true">→</span></Link>
    </div>
  );
}
