# i-shopper — Agent Entry Point

## What this is
A consumer-side AI shopping agent that understands user intent, asks clarifying questions,
and returns personalized product recommendations with explanations. MVP uses prompted LLMs
in place of trained models to validate the core user hypothesis before investing in training.

## Stack
- **Frontend + Backend:** Next.js 14 (App Router) + Vercel
- **Intent/Query Agent:** GPT-4o (tool calling)
- **Reranker/Profile Agent:** Claude Sonnet (long context)
- **User profiles:** Vercel KV (Redis)
- **Session logs:** Supabase
- **Product API:** SerpAPI

## Before coding anything
1. Read `.claude/context/architecture.md` — understand the full data flow
2. Read `.claude/context/decisions.md` — understand WHY decisions were made, do not override them
3. Read `.claude/specs/mvp.md` — the executable spec, ground truth for all features
4. Check `.claude/progress/PROGRESS.md` — current state, what's done, what's next

## Critical constraints
- **K ≤ 5 products** shown per recommendation set to the user after the reranker. Never exceed this. 
- **Null product state is first-class** — if top candidate score from the reranker < threshold, do NOT force a recommendation. Instead, generate explanation with the LLM why it thinks no proper products to recommend (e.g. none matches the user need / too expensive / etc.)
- **No dark patterns** — UI must not optimize for conversion. Trust is the product.
- **Profile is user-readable JSON** — never encode it in embeddings or opaque formats in MVP.
- **Every accept/reject click is a labeled data point** — log it with full context, never drop it.
- **2-week ship target** — do not over-engineer. Prompts over training, simple over clever.

## Key invariants
- User profile = structured JSON, always injected into reranker prompt verbatim
- Each session produces: (intent, candidate pool, accepted/rejected) tuple — logged to Supabase
- Profile update happens after session end, not mid-session
- Clarifying questions: max 2 per session before committing to search

## What NOT to do
- Do not add authentication complexity in MVP — simple session ID is enough
- Do not train any models — prompting only for MVP
- Do not show more than 5 product cards
- Do not auto-update profile without user action (accept/reject/feedback)
- Do not use streaming for reranker output — wait for full ranked list before rendering

## Session End Protocol
At the end of every session, always update .claude/progress/PROGRESS.md with:
- What was completed (check off checklist items)
- Any bugs or blockers encountered
- What to tackle next session