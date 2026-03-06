# MVP Executable Spec

## Scope

This is the ground truth for what gets built. Anything not in this spec is out of scope for MVP.

---

## Feature 1: Onboarding Flow

**Trigger:** First session (no profile in KV)
**UI:** 3-5 swipeable preference cards (not a form)

**Cards to show (in order):**

1. Product categories of interest (multi-selection on some general categories -- less than 10 candidates in total to reduce user burden)
2. Priority attributes (multi-select chips: durability / price / brand / eco / reviews / speed)
3. Anti-preferences (multi-select: specific brands to avoid, materials, form factors)

**Output:** Initial profile JSON written to Vercel KV
**Time target:** < 60 seconds to complete
**Skip allowed:** Yes — skipping = no profile data, system falls back to generic scoring

**Implementation notes:**

- Cards are swipeable on mobile, clickable on desktop
- No more than 5 cards total
- Each card has a "Skip" option
- On completion, write profile and redirect to main chat

---

## Feature 2: Intent Agent (GPT-4o)

**Input:** User's natural language shopping query
**Output:** 2-3 search queries + constraint chips + optional clarifying question

**Prompt contract:**

- System: You are a shopping assistant. Parse the user's intent. If ambiguous, ask ONE clarifying question about budget or use case. Generate 2-3 specific product search queries. Return as JSON.
- Output schema:

```json
{
  "needsClarification": false,
  "clarifyingQuestion": null,
  "detectedConstraints": [
    { "type": "budget", "value": "under $150" },
    { "type": "shipping", "value": "US only" }
  ],
  "searchQueries": ["query1", "query2", "query3"]
}
```

**Rules:**

- Max 1 clarifying question per turn
- Max 2 clarifying questions per session total
- If user has existing profile, use it to resolve ambiguity before asking
- Never ask about something already in the profile

---

## Feature 3: Product API Layer

**Primary:** SerpAPI — Google Shopping engine (`engine=google_shopping`)
**Fallback:** SerpAPI — Amazon engine (`engine=amazon`, same API key)

**SerpAPI call example:**

```typescript
const params = {
  engine: "google_shopping",
  q: searchQuery,
  api_key: process.env.SERPAPI_KEY,
  num: 10
}
// Returns structured: title, price, rating, reviews, thumbnail, link
```

**Per query:**

- Fetch top 10 results
- Normalize to common schema:

```typescript
type Product = {
  id: string
  title: string
  price: number
  currency: string
  imageUrl: string
  retailerUrl: string
  rating: number
  reviewCount: number
  source: 'amazon' | 'google'
  rawAttributes: Record<string, string>
}
```

- Deduplicate across queries by title similarity (> 0.85 = same product)
- Target candidate pool size: 20-50 products

---

## Feature 4: Reranker Agent (Claude Sonnet)

**Input:** Candidate pool (20-50 products) + user profile JSON
**Output:** Top-K ranked products (K ≤ 5) with scores and reasons

**Prompt contract:**

- System: You are a personalized product ranker. Score each product 0-1 against the user profile. Return only the top 5. If the highest score is below {CONFIDENCE_THRESHOLD}, set nullProduct=true.
- Output schema:

```json
{
  "nullProduct": false,
  "results": [
    {
      "productId": "...",
      "score": 0.87,
      "reason": "Matches your durability priority; 4.6 stars across 3,200 reviews",
      "matchedAttributes": ["durability", "reviews"]
    }
  ]
}
```

**Rules:**

- Reason must be 1 line, ≤ 15 words, profile-grounded (not generic)
- Score must reflect profile match, not just product quality
- If nullProduct=true, return empty results array
- Never hallucinate product attributes not in rawAttributes

---

## Feature 5: Product Card UI

**Each card shows:**

- Product image (from API)
- Product name (truncated to 2 lines)
- Price
- 1-line reason (from reranker)
- Star rating + review count
- "Buy on [Retailer]" external link button

**Card set layout:**

- Max 5 cards
- Ordered by reranker score (no secondary sort)
- Constraint chips above cards (editable — clicking removes constraint and triggers re-search)

**Null product state:**

- Full-width message: "I'm not confident enough to recommend yet"
- Two buttons: "Refine your request" | "See best available anyway"
- "See best available" shows cards with a yellow "Low confidence" badge

---

## Feature 6: Decision Buttons + Feedback

**Three buttons below card set:**


| Button          | Action                 | Follow-up                                                                                                             |
| --------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Accept (Buy)    | Log accept + productId | Optional: "What made you choose this?" → multi-select attribute tags + free text                                      |
| Suggest Similar | Log suggest_similar    | Required: "What would you change?" → pre-populated chips (too expensive / wrong brand / different style / wrong spec) |
| Reject All      | Log reject_all         | Optional: "What was missing?" → free text + chips                                                                     |


**Rules:**

- Follow-ups are non-blocking (can be skipped with "Skip" button)
- Skipping is itself logged as a signal
- After feedback collected (or skipped), trigger profile update agent

---

## Feature 7: Profile Update Agent (Claude Sonnet)

**Trigger:** After session ends (any decision button clicked + feedback collected/skipped)
**Input:** Profile before, session decision, feedback, accepted/rejected product attributes
**Output:** Updated profile JSON

**Update rules:**

- Accept → boost weight of matching attributes (+0.1 to weight, max 2.0)
- Reject All → add rejected product attributes to anti-preferences (if user confirms)
- Suggest Similar → update budget range or add constraint based on chips selected
- Profile update is additive — never delete existing preferences without explicit user action

---

## Feature 8: Session Logging

**Every session logs to Supabase:**

- Full session tuple (see architecture.md for schema)
- Profile state before and after
- Timestamp, session duration, number of clarifying turns

**This is non-negotiable.** Every interaction must be logged. Never drop log writes silently — use a queue or retry if Supabase is unavailable.

---

## Out of Scope for MVP

- User accounts / authentication
- Cross-device profile sync
- Price tracking / alerts
- Comparison view
- Any model training
- Mobile app (web only, but must be mobile-responsive)
- Payment integration
- Affiliate link tracking (add later)

