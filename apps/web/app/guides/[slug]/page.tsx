import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedbackForm } from "@/components/feedback-form";
import { fetchGuide } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await fetchGuide(slug);
  return guide ? { title: guide.title, description: guide.summary } : { title: "Guide not found" };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await fetchGuide(slug);
  if (!guide) notFound();

  return (
    <div className="page-width page-shell guide-detail-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/guides">Setup guides</Link><span aria-hidden="true">/</span><span>{guide.title}</span></nav>
      <header className="guide-detail-header"><div><span className="eyebrow">{guide.platform} · {guide.steps.length} steps</span><h1>{guide.title}</h1><p>{guide.summary}</p></div><div className="guide-reviewed"><span>Last reviewed</span><strong>{guide.lastVerifiedAt}</strong><small>{guide.versionContext}</small></div></header>
      <div className="guide-detail-grid">
        <article className="guide-article">
          <p className="guide-intro">{guide.intro}</p>
          <figure className="guide-screenshot"><Image src={guide.imagePath} alt={guide.imageAlt} width={900} height={560} unoptimized /><figcaption>Privacy-safe interface illustration, not a literal device capture. Menu labels may vary by device version.</figcaption></figure>
          <section className="guide-prerequisites"><span className="eyebrow">Before you begin</span><ul>{guide.prerequisites.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></section>
          <section className="guide-steps"><span className="eyebrow">Step by step</span><ol>{guide.steps.map((step) => <li key={step.position}><span className="step-number">{String(step.position).padStart(2, "0")}</span><div><h2>{step.title}</h2><p>{step.instruction}</p>{step.note && <p className="step-note">{step.note}</p>}</div></li>)}</ol></section>
          <div className="guide-aftercare"><section><span className="eyebrow">Undo the change</span><p>{guide.undoSteps}</p></section><section><span className="eyebrow">If something looks different</span><p>{guide.troubleshooting}</p></section></div>
          <section className="guide-sources"><span className="eyebrow">Official instructions</span><h2>Check the source</h2><p>We reviewed this guide on {guide.lastVerifiedAt}. Use the official instructions if your menus differ.</p><ul>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <span aria-hidden="true">↗</span></a><small>{source.sourceType} · checked {source.checkedAt}</small></li>)}</ul></section>
          {guide.resource && <Link className="guide-resource-link" href={`/resources/${guide.resource.slug}`}>Compare this setup with other options: {guide.resource.name} <span aria-hidden="true">→</span></Link>}
        </article>
        <aside className="guide-sidebar"><div className="sidebar-card sidebar-card-green"><span className="eyebrow">Keep your routine yours</span><p>Use the smallest setting that helps. Keep essential communication, accessibility features, and emergency options available.</p><div className="sidebar-rule"/><span className="eyebrow">Guide context</span><p className="small-copy">{guide.versionContext}</p></div><FeedbackForm guideSlug={guide.slug} /></aside>
      </div>
    </div>
  );
}
