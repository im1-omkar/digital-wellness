import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackForm } from "@/components/feedback-form";
import { fetchResource } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await fetchResource(slug);
  return resource ? { title: resource.name, description: resource.purpose } : { title: "Resource not found" };
}

const costLabels = { built_in: "Built in", free: "Free", freemium: "Free + paid features", paid: "Paid", open_source: "Free · open source" } as const;

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = await fetchResource(slug);
  if (!resource) notFound();

  return (
    <div className="page-width page-shell detail-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/resources">Resources</Link><span aria-hidden="true">/</span><span>{resource.name}</span></nav>
      <section className="detail-hero">
        <div className="detail-hero-copy">
          <span className="eyebrow">{resource.category.name}</span>
          <h1>{resource.name}</h1>
          <p className="detail-lede">{resource.purpose}</p>
          <div className="platform-list detail-platforms">{resource.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div>
          <div className="detail-hero-actions"><Link href="/guides" className="button button-dark">Browse setup guides <span aria-hidden="true">→</span></Link><span className={`cost-pill cost-${resource.costLabel}`}>{costLabels[resource.costLabel]}</span></div>
        </div>
        <div className="detail-hero-art" aria-hidden="true"><div className="detail-art-ring"/><div className="detail-art-sun"/><div className="detail-art-note"><span>GOOD TO KNOW</span><strong>{resource.bestFor}</strong><small>Last reviewed {resource.lastVerifiedAt}</small></div></div>
      </section>
      <section className="detail-content-grid">
        <div className="detail-main">
          <section className="detail-block"><span className="eyebrow">At a glance</span><h2>What it helps with</h2><p>{resource.bestFor}</p><div className="quick-start"><span className="quick-icon" aria-hidden="true">↗</span><div><b>A simple first step</b><p>{resource.quickStart}</p></div></div></section>
          <section className="detail-block"><span className="eyebrow">The useful details</span><h2>Before you choose</h2><div className="criteria-list">
            <article><span className="criteria-icon">$</span><div><h3>Cost</h3><p>{resource.costDetails}</p></div></article>
            <article><span className="criteria-icon">⌑</span><div><h3>Account & permissions</h3><p>{resource.accountRequirements}</p></div></article>
            <article><span className="criteria-icon">◌</span><div><h3>Privacy</h3><p>{resource.privacyNotes}</p></div></article>
            <article><span className="criteria-icon">Aa</span><div><h3>Accessibility</h3><p>{resource.accessibilityNotes}</p></div></article>
            <article><span className="criteria-icon">!</span><div><h3>Limitations</h3><p>{resource.limitations}</p></div></article>
          </div></section>
          <section className="detail-block detail-sources"><span className="eyebrow">Go to the source</span><h2>Official information</h2><p>We checked these pages on {resource.lastVerifiedAt}. Product details can change, so confirm important settings and prices before you act.</p><ul>{resource.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span aria-hidden="true">↗</span></a><small>{source.sourceType} · checked {source.checkedAt}</small></li>)}</ul></section>
        </div>
        <aside className="detail-sidebar">
          <div className="sidebar-card sidebar-card-green"><span className="eyebrow">A good match if</span><p>{resource.bestFor}</p><div className="sidebar-rule"/><span className="eyebrow">Your platform</span><div className="platform-list">{resource.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div></div>
          <div className="sidebar-card"><span className="eyebrow">Need a hand getting started?</span><p>Browse the setup guides for a short walkthrough and a clear undo path.</p><Link href={`/guides?resource=${resource.slug}`} className="text-link">Find a matching guide <span aria-hidden="true">→</span></Link></div>
          <FeedbackForm resourceSlug={resource.slug} />
        </aside>
      </section>
    </div>
  );
}
