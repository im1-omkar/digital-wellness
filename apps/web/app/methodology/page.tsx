import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "How we review", description: "How Wellspace selects and checks digital wellness resources." };

const principles = [
  { number: "01", title: "Start with a real need", text: "We organize resources around practical student goals: focus, screen-time routines, notifications, sleep routines, and privacy or digital safety." },
  { number: "02", title: "Check official information", text: "We use product, support, pricing, license, and privacy pages from the provider or platform. Each resource shows its source links and review date." },
  { number: "03", title: "Make trade-offs visible", text: "We use the same comparison fields for every listing: purpose, supported platforms, cost, account or permission needs, privacy notes, accessibility considerations, and limitations." },
  { number: "04", title: "Say what we do not know", text: "A vendor statement is not an independent privacy or accessibility audit. We qualify claims and link to the source so students can check the detail themselves." }
];

export default function MethodologyPage() {
  return (
    <div className="page-width page-shell methodology-shell">
      <div className="page-intro methodology-intro"><div><span className="eyebrow">Our review method</span><h1>Useful information.<br /><em>Without the hype.</em></h1></div><p>This hub is designed to help students choose and use practical tools, not to tell anyone how they should use technology.</p></div>
      <section className="method-intro"><span className="method-flower" aria-hidden="true">✳</span><div><span className="eyebrow">The idea behind the hub</span><h2>Help you make an informed choice — not just click a link.</h2><p>We describe what a tool does, where it works, what it costs, and what to consider before setup. We avoid diagnosis, health promises, and “one best tool” rankings.</p></div></section>
      <div className="principles-grid">{principles.map((item) => <article key={item.number}><span>{item.number}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div>
      <section className="method-detail-grid"><article><span className="eyebrow">What the labels mean</span><h2>Cost labels</h2><ul><li><strong>Built in:</strong> included with a supported device or operating system; device costs still apply.</li><li><strong>Free:</strong> the described feature is available without a purchase. We explain important limits.</li><li><strong>Free + paid features:</strong> some capabilities are free, while the named paid features need payment.</li><li><strong>Free · open source:</strong> the listing identifies an open-source license; review permissions and project activity before installing.</li><li><strong>Paid:</strong> the recommended capability requires payment. Check the provider's current price and renewal terms directly.</li></ul></article><article><span className="eyebrow">Privacy and safety</span><h2>Read the detail, not just the badge.</h2><p>We distinguish an account requirement, an operating-system permission, and a provider's data-collection statement. A provider's statement is attributed to that provider and is not independently audited by this project.</p><p>Feedback is optional and asks only for an issue type and a short message. Please do not submit names, account details, or personal/health information.</p></article></section>
      <section className="review-cadence"><div><span className="eyebrow">Keep the guide current</span><h2>Checked on <em>November 11, 2026.</em></h2><p>Resource and guide records show the date their official sources were reviewed. Prices, device support, menus, and privacy terms can change; always confirm important details at the linked source.</p></div><Link href="/resources" className="button button-dark">Explore resources <span aria-hidden="true">→</span></Link></section>
      <section className="method-bottom"><div><span className="eyebrow">Not medical advice</span><h2>Technology settings are one small part of well-being.</h2><p>This site is an educational guide to digital tools and routines. It cannot assess personal health needs, provide diagnosis, or replace help from a trusted person or qualified professional.</p></div><Link href="/guides" className="text-link">See the setup guides <span aria-hidden="true">→</span></Link></section>
    </div>
  );
}
