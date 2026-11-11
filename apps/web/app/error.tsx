"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page-width error-shell">
      <span className="eyebrow">A quick pause</span>
      <h1>We couldn’t load<br /><em>that page just now.</em></h1>
      <p>The resource service may be starting or temporarily unavailable. Please try again in a moment.</p>
      <div className="hero-actions"><button type="button" className="button button-dark" onClick={() => reset()}>Try again <span aria-hidden="true">↻</span></button><a className="button button-light" href="/">Back to home</a></div>
    </div>
  );
}
