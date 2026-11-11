import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">dw</span>
            <span className="brand-name">well<span>space</span></span>
          </Link>
          <p>Small, practical changes for a healthier relationship with technology.</p>
        </div>
        <div className="footer-links">
          <Link href="/resources">Resource library</Link>
          <Link href="/guides">Setup guides</Link>
          <Link href="/methodology">Review method</Link>
        </div>
        <p className="footer-note">Educational guide. Choose what works for your devices, needs, and privacy preferences.</p>
      </div>
    </footer>
  );
}
