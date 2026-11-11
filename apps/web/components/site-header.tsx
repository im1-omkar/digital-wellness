import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <Link className="brand" href="/" aria-label="Digital Wellness Hub home">
          <span className="brand-mark" aria-hidden="true">dw</span>
          <span className="brand-name">well<span>space</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/resources">Explore tools</Link>
          <Link href="/guides">Setup guides</Link>
          <Link href="/methodology">How we review</Link>
        </nav>
        <Link className="header-cta" href="/resources">Find your fit <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
