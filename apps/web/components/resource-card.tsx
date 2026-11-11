import Link from "next/link";
import type { Resource } from "@wellness/contracts";

const costLabels: Record<Resource["costLabel"], string> = {
  built_in: "Built in",
  free: "Free",
  freemium: "Free + paid features",
  paid: "Paid",
  open_source: "Free · open source"
};

export function ResourceCard({ resource, compact = false }: { resource: Resource; compact?: boolean }) {
  return (
    <article className={`resource-card${compact ? " resource-card-compact" : ""}`}>
      <div className="resource-card-topline">
        <span className="eyebrow">{resource.category.name}</span>
        <span className={`cost-pill cost-${resource.costLabel}`}>{costLabels[resource.costLabel]}</span>
      </div>
      <h3><Link href={`/resources/${resource.slug}`}>{resource.name}<span className="card-arrow" aria-hidden="true">↗</span></Link></h3>
      <p className="resource-purpose">{resource.purpose}</p>
      <p className="resource-fit"><strong>May suit:</strong> {resource.bestFor}</p>
      <div className="platform-list" aria-label="Supported platforms">
        {resource.platforms.map((platform) => <span key={platform}>{platform}</span>)}
      </div>
      {!compact && <p className="resource-cost-note">{resource.costDetails}</p>}
      <div className="resource-card-bottom">
        <span>Checked {resource.lastVerifiedAt}</span>
        <Link href={`/resources/${resource.slug}`} className="text-link">See details <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
