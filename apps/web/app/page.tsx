import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { fetchCategories, fetchResources } from "@/lib/api";

const goals = [
  { label: "Focus on study", value: "focus", symbol: "↗", text: "Quiet the pings and make room for one task." },
  { label: "Set screen limits", value: "screen-time", symbol: "◷", text: "Try a gentle timer or a device routine." },
  { label: "Build a bedtime routine", value: "bedtime", symbol: "☾", text: "Make evenings a little less screen-led." },
  { label: "Review privacy", value: "privacy", symbol: "⌑", text: "Check your account controls and safety basics." }
];

export default async function HomePage() {
  const [{ items, total }, categories] = await Promise.all([
    fetchResources({ limit: "3" }),
    fetchCategories()
  ]);

  return (
    <>
      <section className="hero-section">
        <div className="page-width hero-grid">
          <div className="hero-copy">
            <span className="kicker"><span className="kicker-dot" /> A student-friendly digital wellness guide</span>
            <h1>Make your tech<br /><em>work for your day.</em></h1>
            <p className="hero-lede">Find practical tools for focus, screen time, notifications, and privacy — with honest trade-offs and simple setup steps.</p>
            <div className="hero-actions">
              <Link href="/resources" className="button button-dark">Explore the library <span aria-hidden="true">→</span></Link>
              <Link href="/guides" className="button button-light">See setup guides</Link>
            </div>
            <div className="hero-meta"><span className="tiny-check">✓</span> No account needed to browse <span className="meta-divider">·</span> Your choices stay in this session</div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustration of a calmer digital workspace">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sun" />
            <div className="focus-card card-top"><span className="mini-mark">◷</span><span><b>Study block</b><small>25 min · notifications quiet</small></span><span className="toggle-on" /></div>
            <div className="phone-art"><div className="phone-notch" /><div className="phone-screen"><span className="screen-label">TODAY</span><div className="screen-greeting">A little more<br /><strong>headspace.</strong></div><div className="screen-line line-long" /><div className="screen-line line-short" /><div className="screen-focus"><span>◒</span><span>Focus mode<br /><small>On until 10:30</small></span><b>✓</b></div><div className="screen-nav"><i /><i /><i /><i /></div></div></div>
            <div className="focus-card card-bottom"><span className="mini-mark mini-leaf">✳</span><span><b>Small steps count</b><small>Choose what feels useful</small></span></div>
            <span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span>
            <p className="art-caption">A calmer setup starts with one small choice.</p>
          </div>
        </div>
      </section>

      <section className="section page-width goal-section">
        <div className="section-heading">
          <div><span className="eyebrow">Start where you are</span><h2>What would you like to change?</h2></div>
          <p>Pick a goal to see options that fit. No diagnosis, no perfect routine — just practical choices.</p>
        </div>
        <div className="goal-grid">
          {goals.map((goal, index) => (
            <Link className="goal-card" href={`/resources?goal=${goal.value}`} key={goal.value}>
              <span className={`goal-number goal-number-${index + 1}`}>{goal.symbol}</span>
              <span className="goal-label">{goal.label}</span>
              <span className="goal-text">{goal.text}</span>
              <span className="goal-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="browse-band">
        <div className="page-width browse-band-inner">
          <div><span className="eyebrow eyebrow-light">A good fit is personal</span><h2>Compare the details<br />that actually matter.</h2></div>
          <div className="browse-points">
            <div><span>01</span><p>Check the device and browser each tool supports.</p></div>
            <div><span>02</span><p>See what is free, what costs, and where paid features start.</p></div>
            <div><span>03</span><p>Review account, privacy, and accessibility notes before you choose.</p></div>
          </div>
          <Link href="/resources" className="button button-cream">Browse all resources <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="section page-width">
        <div className="section-heading section-heading-tight">
          <div><span className="eyebrow">The resource shelf</span><h2>Start with a few well-reviewed options.</h2></div>
          <Link href="/resources" className="text-link">See all {total} resources <span aria-hidden="true">→</span></Link>
        </div>
        <div className="resource-grid home-resource-grid">
          {items.map((resource) => <ResourceCard key={resource.slug} resource={resource} compact />)}
        </div>
      </section>

      <section className="guide-promo page-width">
        <div className="guide-promo-art" aria-hidden="true"><div className="promo-sheet"><div className="promo-sheet-top"><span>01</span><span>QUICK SETUP</span></div><div className="promo-heading">One setting.<br /><em>A little more calm.</em></div><div className="promo-rule" /><div className="promo-check"><b>✓</b><span>Choose one change to try today</span></div><div className="promo-check"><b>✓</b><span>Keep the settings you still need</span></div><div className="promo-bottom" /></div><span className="promo-star">✳</span></div>
        <div className="guide-promo-copy"><span className="eyebrow">Good tools need good setup</span><h2>Skip the guesswork.<br /><em>Follow a short guide.</em></h2><p>Student-friendly walkthroughs with clear steps, current source links, and privacy-safe illustrations.</p><Link href="/guides" className="button button-dark">Open setup guides <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="trust-strip page-width" aria-label="How the hub works">
        <div><span className="trust-icon">↻</span><span><strong>Checked against official sources</strong><small>Every listing shows its review date.</small></span></div>
        <div><span className="trust-icon">◌</span><span><strong>Clear about trade-offs</strong><small>Cost, platforms, privacy, and limits.</small></span></div>
        <div><span className="trust-icon">⌁</span><span><strong>Made for real student routines</strong><small>Practical steps, no pressure to optimize everything.</small></span></div>
      </section>

      <section className="category-ribbon page-width">
        <span className="eyebrow">Explore by topic</span>
        <div className="category-links">
          {categories.map((category) => <Link key={category.slug} href={`/resources?category=${category.slug}`}>{category.name}<span>{category.count}</span></Link>)}
        </div>
      </section>
    </>
  );
}
