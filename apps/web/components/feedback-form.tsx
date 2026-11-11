"use client";

import { useState, type FormEvent } from "react";

type Props = { resourceSlug?: string; guideSlug?: string };

export function FeedbackForm({ resourceSlug, guideSlug }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("sending");
    const form = new FormData(formElement);
    const payload = {
      resourceSlug,
      guideSlug,
      issueType: String(form.get("issueType") || "other"),
      message: String(form.get("message") || "")
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Feedback could not be sent.");
      formElement.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="feedback-card" onSubmit={submit}>
      <span className="eyebrow">Help us keep it useful</span>
      <label><span>What should we look at?</span><select name="issueType" defaultValue="unclear"><option value="unclear">Something is unclear</option><option value="broken_link">A link is broken</option><option value="outdated">This may be outdated</option><option value="accessibility">Accessibility issue</option><option value="other">Something else</option></select></label>
      <label><span>Your note</span><textarea name="message" minLength={5} maxLength={1000} required rows={4} placeholder="Tell us what to review (5–1000 characters)." /></label>
      <p className="privacy-helper">Please don’t include your name, account details, or personal/health information. Reports are deleted or anonymized within 90 days after resolution.</p>
      <button className="button button-dark" disabled={state === "sending"} type="submit">{state === "sending" ? "Sending…" : "Send a note"}<span aria-hidden="true">→</span></button>
      <p className={`form-status ${state}`} aria-live="polite">{state === "sent" ? "Thanks — your note was sent for review." : state === "error" ? "We couldn’t send this note. Please try again later." : ""}</p>
    </form>
  );
}
