import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@wellness/contracts";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      <Link className="guide-image-link" href={`/guides/${guide.slug}`} aria-label={`Read guide: ${guide.title}`}>
        <Image src={guide.imagePath} alt={guide.imageAlt} width={900} height={560} unoptimized />
        <span className="guide-step-count">{guide.steps.length} steps</span>
      </Link>
      <div className="guide-card-copy"><span className="eyebrow">{guide.platform}</span><h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.summary}</p><div className="guide-card-bottom"><span>Checked {guide.lastVerifiedAt}</span><Link href={`/guides/${guide.slug}`} className="text-link">Open guide <span aria-hidden="true">→</span></Link></div></div>
    </article>
  );
}
