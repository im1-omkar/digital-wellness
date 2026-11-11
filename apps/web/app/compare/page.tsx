import type { Metadata } from "next";
import Link from "next/link";
import { fetchComparison } from "@/lib/api";

export const metadata: Metadata = { title: "Compare resources", description: "Compare digital wellness tools using the same practical criteria." };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const costLabels = { built_in: "Built in", free: "Free", freemium: "Free + paid features", paid: "Paid", open_source: "Free · open source" } as const;

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = typeof params.items === "string" ? params.items : "";
  const slugs = [...new Set(raw.split(",").map((item) => item.trim()).filter(Boolean))].slice(0, 3);
  const resources = slugs.length >= 2 ? await fetchComparison(slugs) : [];

  return (
    <div className="page-width page-shell compare-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/resources">Resources</Link><span aria-hidden="true">/</span><span>Compare</span></nav>
      <div className="page-intro compare-intro"><div><span className="eyebrow">Make an informed choice</span><h1>Compare the<br /><em>details side by side.</em></h1></div><p>There is no universal “best” tool. Compare what each option does, what it costs, and what to consider before you set it up.</p></div>
      {resources.length < 2 ? (
        <div className="compare-empty"><span className="compare-empty-icon" aria-hidden="true">↔</span><h2>Choose at least two options</h2><p>Go back to the resource library, select two or three resources, then compare their features and trade-offs here.</p><Link href="/resources" className="button button-dark">Choose resources <span aria-hidden="true">→</span></Link></div>
      ) : (
        <>
          <div className="compare-table-wrap"><table className="compare-table"><caption className="sr-only">Comparison of {resources.map((resource) => resource.name).join(", ")}</caption><thead><tr><th scope="col">What matters</th>{resources.map((resource) => <th scope="col" key={resource.slug}><span className="compare-category">{resource.category.name}</span><Link href={`/resources/${resource.slug}`}>{resource.name}</Link><small>{resource.platforms.join(" · ")}</small></th>)}</tr></thead><tbody>
            <tr><th scope="row">Purpose</th>{resources.map((resource) => <td key={resource.slug}>{resource.purpose}</td>)}</tr>
            <tr><th scope="row">May suit</th>{resources.map((resource) => <td key={resource.slug}>{resource.bestFor}</td>)}</tr>
            <tr><th scope="row">Cost</th>{resources.map((resource) => <td key={resource.slug}><strong>{costLabels[resource.costLabel]}</strong><br />{resource.costDetails}</td>)}</tr>
            <tr><th scope="row">Account & permissions</th>{resources.map((resource) => <td key={resource.slug}>{resource.accountRequirements}</td>)}</tr>
            <tr><th scope="row">Privacy</th>{resources.map((resource) => <td key={resource.slug}>{resource.privacyNotes}</td>)}</tr>
            <tr><th scope="row">Accessibility</th>{resources.map((resource) => <td key={resource.slug}>{resource.accessibilityNotes}</td>)}</tr>
            <tr><th scope="row">Limitations</th>{resources.map((resource) => <td key={resource.slug}>{resource.limitations}</td>)}</tr>
            <tr><th scope="row">Review date</th>{resources.map((resource) => <td key={resource.slug}>Checked {resource.lastVerifiedAt}<p className="table-source-links">{resource.sources.slice(0, 2).map((source) => <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}>{source.label} ↗</a>)}</p></td>)}</tr>
          </tbody></table></div>
          <section className="compare-mobile-grid" aria-label="Resource comparison">
            {resources.map((resource) => <article className="compare-mobile-card" key={resource.slug}>
              <div className="compare-mobile-title"><span className="compare-category">{resource.category.name}</span><Link href={`/resources/${resource.slug}`}>{resource.name} <span aria-hidden="true">↗</span></Link><small>{resource.platforms.join(" · ")}</small></div>
              <dl>
                <div><dt>Purpose</dt><dd>{resource.purpose}</dd></div>
                <div><dt>May suit</dt><dd>{resource.bestFor}</dd></div>
                <div><dt>Cost</dt><dd><strong>{costLabels[resource.costLabel]}</strong><br />{resource.costDetails}</dd></div>
                <div><dt>Account & permissions</dt><dd>{resource.accountRequirements}</dd></div>
                <div><dt>Privacy</dt><dd>{resource.privacyNotes}</dd></div>
                <div><dt>Accessibility</dt><dd>{resource.accessibilityNotes}</dd></div>
                <div><dt>Limitations</dt><dd>{resource.limitations}</dd></div>
                <div><dt>Official sources · checked {resource.lastVerifiedAt}</dt><dd className="mobile-source-links">{resource.sources.slice(0, 2).map((source) => <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.url}>{source.label} ↗</a>)}</dd></div>
              </dl>
            </article>)}
          </section>
          <div className="compare-disclaimer"><span aria-hidden="true">✳</span><p><strong>Use the comparison as a starting point.</strong> Product terms and supported features can change. Check official sources before installing or paying.</p></div>
        </>
      )}
    </div>
  );
}
