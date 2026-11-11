import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { fetchGuides } from "@/lib/api";

export const metadata: Metadata = { title: "Setup guides", description: "Short, privacy-safe walkthroughs for setting up practical digital wellness tools." };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function GuidesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const resource = typeof params.resource === "string" ? params.resource : undefined;
  const guides = await fetchGuides(resource ? { resource } : {});
  return (
    <div className="page-width page-shell">
      <div className="page-intro guides-intro"><div><span className="eyebrow">Short, practical walkthroughs</span><h1>Set it up with<br /><em>less guesswork.</em></h1></div><p>Clear steps, relevant privacy-safe illustrations, and a way to undo each change. Device menus can vary — every guide links back to the official instructions.</p></div>
      {resource && <div className="filter-notice">Showing guides for a selected resource. <Link href="/guides">Show all guides</Link></div>}
      <div className="guide-list-heading"><span className="eyebrow">Start with one small change</span><p>{guides.length} guides · Reviewed {guides.reduce((latest, guide) => guide.lastVerifiedAt > latest ? guide.lastVerifiedAt : latest, "2026-01-01")}</p></div>
      {guides.length ? <div className="guide-grid">{guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div> : <div className="empty-state"><h2>No guide is linked to that resource yet</h2><p>Try browsing all setup guides or check the resource page for its quick-start steps.</p><Link href="/guides" className="button button-secondary">Show all guides</Link></div>}
      <aside className="guide-safety-note"><span aria-hidden="true">✳</span><p><strong>Try a setting before you lock it in.</strong> Start with a short session, keep essential contacts and accessibility tools available, and make sure you know how to undo the change.</p></aside>
    </div>
  );
}
