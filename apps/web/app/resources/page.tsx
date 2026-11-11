import type { Metadata } from "next";
import { ResourceList } from "@/components/resource-list";
import { fetchCategories, fetchResources } from "@/lib/api";

export const metadata: Metadata = { title: "Explore resources", description: "Filter and compare digital wellness resources by goal, device, and cost." };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ResourcesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const single = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const selected = {
    q: single("q"), category: single("category"), platform: single("platform"),
    cost: single("cost"), goal: single("goal")
  };
  const [{ items, total }, categories] = await Promise.all([
    fetchResources({ ...selected, limit: "100" }),
    fetchCategories()
  ]);

  return (
    <div className="page-width page-shell">
      <div className="page-intro resources-intro">
        <div><span className="eyebrow">The resource library</span><h1>Find a tool that<br /><em>fits your day.</em></h1></div>
        <p>Compare practical options by what you want to change, the device you use, and what feels right for your budget and privacy preferences.</p>
      </div>
      <section className="catalog-panel" aria-labelledby="filter-heading">
        <div className="catalog-panel-heading"><div><span className="eyebrow">Browse thoughtfully</span><h2 id="filter-heading">Narrow it down</h2></div><p>{total} reviewed resources</p></div>
        <form className="filter-form" action="/resources" method="get">
          <label className="search-field"><span>Search tools</span><span className="search-input-wrap"><span aria-hidden="true">⌕</span><input name="q" type="search" placeholder="Try “study focus”" defaultValue={selected.q} /></span></label>
          <label><span>Your goal</span><select name="goal" defaultValue={selected.goal}><option value="">Any goal</option><option value="focus">Focus</option><option value="study">Study</option><option value="screen-time">Screen time</option><option value="bedtime">Bedtime</option><option value="notifications">Notifications</option><option value="privacy">Privacy</option><option value="safety">Safety</option></select></label>
          <label><span>Topic</span><select name="category" defaultValue={selected.category}><option value="">All topics</option>{categories.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select></label>
          <label><span>Platform</span><select name="platform" defaultValue={selected.platform}><option value="">Any platform</option><option>iPhone</option><option>Android</option><option>Windows</option><option>macOS</option><option>Firefox</option><option>Web browser</option></select></label>
          <label><span>Cost</span><select name="cost" defaultValue={selected.cost}><option value="">Any cost</option><option value="built_in">Built in</option><option value="free">Free</option><option value="freemium">Free + paid features</option><option value="open_source">Open source</option><option value="paid">Paid</option></select></label>
          <div className="filter-actions"><button className="button button-dark" type="submit">Show matches <span aria-hidden="true">→</span></button><a href="/resources" className="text-link">Reset filters</a></div>
        </form>
      </section>
      <div className="results-heading"><div><span className="eyebrow">A considered shortlist</span><h2>{items.length === total ? "All resources" : `${items.length} matching ${items.length === 1 ? "resource" : "resources"}`}</h2></div><p>Choose two or three to compare side by side.</p></div>
      <ResourceList resources={items} />
      <aside className="catalog-note"><span className="note-mark">i</span><p><strong>Take what helps, leave what doesn’t.</strong> These tools are options, not rules. Check the linked official information before installing or changing settings.</p><a href="/methodology">How we review resources <span aria-hidden="true">→</span></a></aside>
    </div>
  );
}
