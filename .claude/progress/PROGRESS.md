# Progress

## Current Status
**Phase:** Pre-development
**Week:** 0 (not started)
**Next milestone:** Week 1-2 — Core pipeline working end-to-end

---

## Completed
- [x] Next.js 14 App Router project initialized (manual scaffold — create-next-app blocked by existing .claude/)
- [x] All dependencies installed: openai, @anthropic-ai/sdk, @vercel/kv, @supabase/supabase-js, serpapi
- [x] Full module directory structure created per architecture.md
- [x] All stub files created (API routes, components, agents, db, api helpers)
- [x] `/lib/types/product.ts` — Product, RankedProduct, RerankerOutput types
- [x] `/lib/types/profile.ts` — UserProfile, ProfileData, BudgetRange, PastSignal, AntiPreferences types
- [x] `/lib/types/session.ts` — SessionLog, IntentAgentOutput, Clarification, DetectedConstraint types
- [x] `.env.local.example` created with all required env vars

---

## In Progress
- [ ] (nothing in flight)

---

## Week 1-2 Targets
- [x] Next.js project initialized
- [ ] Environment variables configured (OpenAI, Anthropic, Amazon API, Vercel KV, Supabase)
- [x] `/lib/types` — Product, UserProfile, Session types defined
- [x] `/lib/db/kv.ts` — Vercel KV helpers
- [x] `/lib/db/supabase.ts` — Supabase client + session logging
- [x] `/lib/api/serpApi.ts` — SerpAPI wrapper (Google Shopping primary, Amazon fallback, Jaccard dedup)
- [x] `/lib/agents/intentAgent.ts` — GPT-4o intent + query generation
- [x] `/lib/agents/rerankerAgent.ts` — Claude Sonnet reranker
- [x] `/lib/agents/profileAgent.ts` — Claude Sonnet profile updater
- [x] `/app/api/chat` — Intent agent endpoint
- [x] `/app/api/search` — Product search endpoint
- [x] `/app/api/rerank` — Reranker endpoint
- [x] `/app/api/profile/get` and `/update` — Profile endpoints
- [x] `/app/api/log` — Session logging endpoint
- [ ] Internal e2e test: "I need a laptop bag under $80" → ranked results

## Week 3 Targets
- [x] Onboarding flow (swipeable cards — 3 cards: categories, priority attrs, anti-prefs)
- [x] Main chat UI (full phase state machine: idle→thinking→searching→results/null_product→feedback)
- [x] Product card component (image, title, price, reason, rating, buy link)
- [x] Constraint chips (editable — clicking × triggers re-search)
- [x] Decision buttons (Accept / Suggest Similar / Reject All)
- [x] Feedback follow-up modals (per-decision tag sets + free text + skip)
- [x] Null product state UI ("See best available anyway" shows cards with low-confidence badge)
- [x] app/globals.css — full design system (no external CSS deps)
- [x] /api/onboarding route — writes initial profile to KV
- [ ] Deploy to Vercel + i-shopper.ai domain
- [ ] 5 internal test users

## Week 4 Targets
- [ ] 10-20 external users
- [ ] Session logs flowing into Supabase
- [ ] Profile updates working correctly
- [ ] Bug fixes from user feedback

## Week 5-6 Targets
- [ ] Qualitative interviews (5+ users)
- [ ] Acceptance rate analysis
- [ ] Decision: proceed to trained models or pivot

---

## Known Issues / Blockers
- Amazon Product API approval pending (need to apply)
- Google Shopping API as fallback needs configuration

---

## Key Metrics (fill in as data comes in)
| Metric | Target | Actual |
|--------|--------|--------|
| Acceptance Rate | > 30% | — |
| Reject-All Rate | < 40% | — |
| Null Product Rate | 10-20% | — |
| Avg Session Length | 2-4 turns | — |
| Users (Week 4) | 10-20 | — |

---

## Notes / Decisions Made This Week
- Used SerpAPI (not Amazon Product API) per D10 — architecture.md already reflects this; PROGRESS.md had a stale `/lib/api/amazonApi.ts` entry, left as-is but actual file created is `serpApi.ts`
- Known blockers note about Amazon API approval is now moot (using SerpAPI)
