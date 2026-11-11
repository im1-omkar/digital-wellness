# Resource content review

Review content from provider or platform sources before the first release and at least once each academic term. Recheck sooner if a student reports a broken link, changed price, changed menu, or confusing privacy statement.

For each resource:

1. Open the official product or platform support page and confirm the main purpose and supported platforms.
2. Open the official pricing page or app listing. Check which specific recommended features require payment; use `free + paid features` when that is the accurate description.
3. Open the official privacy page and permission listing. Separate account requirements from permissions and attribute provider data-collection statements to the provider.
4. Check accessibility information when the provider publishes it. If no reliable accessibility information is available, say the hub has not independently assessed it.
5. Confirm the limitations and quick-start path on the current supported device or help page.
6. Record the direct source URLs and checked date in `packages/content/src/catalog.ts` (and in each source record).
7. Mark a resource `draft` in the database or seed file if a material claim has not been confirmed. Do not publish an unsupported claim.

For each setup guide, verify each step against the official source and the stated platform/version. Keep the original illustrations clearly labeled as illustrations. If literal device screenshots are added, use a demo account, remove notifications and personal details, and check the image at full size before publication.

## Review record fields

```text
slug, official_source_url, source_type, checked_at, platform_or_version,
cost_and_paid_features, account_or_permissions, privacy_claim_and_attribution,
accessibility_note, limitation, reviewer_role, follow_up_date
```

Do not record reviewer names or student testers' personal information in public content files.
