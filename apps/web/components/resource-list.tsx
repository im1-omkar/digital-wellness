"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resource } from "@wellness/contracts";

const costLabels: Record<Resource["costLabel"], string> = {
  built_in: "Built in",
  free: "Free",
  freemium: "Free + paid features",
  paid: "Paid",
  open_source: "Free · open source"
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const router = useRouter();

  function toggle(slug: string, name: string) {
    if (selected.includes(slug)) {
      setSelected(selected.filter((item) => item !== slug));
      setNotice(`${name} removed from comparison.`);
      return;
    }
    if (selected.length === 3) {
      setNotice("Compare up to three resources at a time. Remove one to add another.");
      return;
    }
    setSelected([...selected, slug]);
    setNotice(`${name} added to comparison. ${selected.length + 1} selected.`);
  }

  if (!resources.length) {
    return <div className="empty-state"><span className="empty-icon" aria-hidden="true">⌕</span><h2>No matches yet</h2><p>Try a broader search or clear one of the filters.</p><Link className="button button-secondary" href="/resources">Clear filters</Link></div>;
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">{notice}</p>
      <div className="resource-grid">
        {resources.map((resource) => {
          const isSelected = selected.includes(resource.slug);
          return (
            <article className="resource-card" key={resource.slug}>
              <div className="resource-card-topline">
                <span className="eyebrow">{resource.category.name}</span>
                <span className={`cost-pill cost-${resource.costLabel}`}>{costLabels[resource.costLabel]}</span>
              </div>
              <h2><Link href={`/resources/${resource.slug}`}>{resource.name}<span className="card-arrow" aria-hidden="true">↗</span></Link></h2>
              <p className="resource-purpose">{resource.purpose}</p>
              <p className="resource-fit"><strong>May suit:</strong> {resource.bestFor}</p>
              <div className="platform-list" aria-label="Supported platforms">
                {resource.platforms.map((platform) => <span key={platform}>{platform}</span>)}
              </div>
              <p className="resource-cost-note">{resource.costDetails}</p>
              <div className="resource-card-bottom">
                <Link href={`/resources/${resource.slug}`} className="text-link">Details & trade-offs <span aria-hidden="true">→</span></Link>
                <button className={`compare-toggle${isSelected ? " is-selected" : ""}`} type="button" aria-label={`${isSelected ? "Remove" : "Add"} ${resource.name} ${isSelected ? "from" : "to"} comparison`} aria-pressed={isSelected} onClick={() => toggle(resource.slug, resource.name)}>
                  <span aria-hidden="true">{isSelected ? "✓" : "+"}</span> {isSelected ? "Added" : "Compare"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="compare-dock" aria-label="Selected resources for comparison">
          <div><strong>{selected.length} selected</strong><span>{selected.map((slug) => resources.find((resource) => resource.slug === slug)?.name).filter(Boolean).join(" · ")}</span></div>
          <button type="button" className="button button-dark" disabled={selected.length < 2} onClick={() => router.push(`/compare?items=${encodeURIComponent(selected.join(","))}`)}>
            Compare {selected.length >= 2 ? "now" : "(add one more)"} <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="dock-clear" onClick={() => { setSelected([]); setNotice("Comparison selection cleared."); }}>Clear</button>
        </div>
      )}
    </>
  );
}
