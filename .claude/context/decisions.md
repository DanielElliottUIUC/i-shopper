# Technical Decisions

## Purpose

Record WHY each decision was made. Before changing anything here, read the reasoning.
Overriding these without understanding the tradeoffs will break the MVP.

---

## D1: Next.js Full-Stack (not FastAPI + separate frontend)

**Decision:** Single Next.js 14 app with API Routes for everything.
**Why:** 2-week MVP timeline. One deployment, one repo, no CORS, no separate service.
**Tradeoff:** Harder to scale backend independently later. Acceptable for MVP.
**When to revisit:** When reranker latency becomes a bottleneck and needs a dedicated GPU service.

---

## D2: GPT-4o for Intent, Claude Sonnet for Reranker

**Decision:** Split LLM responsibilities by strength.
**Why:**

- GPT-4o tool calling is more reliable for structured query generation + API calls
- Claude Sonnet handles long-context profile injection better (profile JSON can be large)
- Separation makes it easy to swap either independently
**Tradeoff:** Two API dependencies instead of one.
**When to revisit:** If one provider has outages or cost becomes a concern.

---

## D3: User Profile as Readable JSON (not embeddings)

**Decision:** Store profile as structured JSON, inject verbatim into prompts.
**Why:**

- MVP goal is interpretability — user should be able to see why they got a recommendation
- "Reason generation" is a natural byproduct of profile-grounded scoring
- No training infrastructure needed
- Profile is the primary data asset for future trained reranker
**Tradeoff:** Less expressive than learned embeddings. Fine for MVP.
**When to revisit:** When moving to trained personalized reranker (post-MVP).

---

## D4: Vercel KV for Profiles, Supabase for Logs

**Decision:** Two separate storage systems.
**Why:**

- KV: profiles need fast read/write per request (< 10ms), KV is optimal
- Supabase: session logs need SQL queries for analysis, Postgres is optimal
- Don't use one system for both — query patterns are completely different
**Tradeoff:** Two storage dependencies.
**When to revisit:** If Vercel KV costs spike, can migrate profiles to Supabase with Redis cache.

---

## D5: K ≤ 5 Products Hard Limit

**Decision:** Never show more than 5 product cards.
**Why:** Core product thesis — we solve choice overload. Showing 20 results = Amazon.
**Tradeoff:** May miss the right product if it ranks 6th.
**Do NOT change this for MVP.**

---

## D6: Null Product State is First-Class

**Decision:** If top candidate score < `CONFIDENCE_THRESHOLD` (default 0.6), show "Not confident yet" instead of forcing recommendations.
**Why:** Trust is the product. A system that always recommends something is not trustworthy.
**Tradeoff:** Lower apparent "success rate" in early testing. This is intentional.
**Do NOT remove this for MVP.**

---

## D7: Profile Update After Session, Not Mid-Session

**Decision:** Run profile update agent only after the session ends (accept/reject/feedback collected).
**Why:**

- Prevents mid-session drift (profile changing while reranker is scoring)
- Cleaner training signal — full session context available for update
- Simpler to debug and replay
**Tradeoff:** Profile doesn't update in real-time within a session.
**When to revisit:** Never for MVP. For full system, consider online learning.

---

## D8: Max 2 Clarifying Questions

**Decision:** Intent agent asks at most 2 clarifying questions before committing to search.
**Why:**

- User research shows >2 questions = abandonment
- Forces the system to be decisive
- Missing info can be inferred from profile on repeat sessions
**Tradeoff:** First session recommendations may be less accurate.
**Do NOT increase this limit.**

---

## D10: SerpAPI over Amazon Product API

**Decision:** Use SerpAPI (Google Shopping + Amazon engines) instead of official Amazon API.
**Why:**

- Amazon Product Advertising API requires Associates account with 3 verified sales in 180 days — not feasible for MVP
- SerpAPI is register-and-use, no approval process
- Returns structured data (title, price, rating, reviews, image, link) directly
- Same API key covers both Google Shopping and Amazon search engines
- $50/month for 100 searches/day — sufficient for MVP user volume
**Tradeoff:** Not official, scraping-based, could break if Google/Amazon changes layout. Acceptable for MVP.
**When to revisit:** When scaling to production, evaluate official APIs or direct retailer partnerships.
**Decision:** No login, no accounts. Users identified by session ID stored in localStorage.
**Why:** Auth adds 1-2 days of engineering. MVP needs 100 users fast, not secure accounts.
**Tradeoff:** No cross-device persistence, profile lost if localStorage cleared.
**When to revisit:** Week 3-4 if users explicitly request account persistence.

