# Architecture: i-shopper MVP

## System Overview

```
User Input (chat)
      │
      ▼
┌─────────────────────────────┐
│   Intent Agent (GPT-4o)     │  → asks ≤2 clarifying questions if the user intent is not clear
│   • Parse natural language  │  → detects budget, constraints
│   • Generate 2-3 queries    │  → outputs: query[] + constraint chips
└─────────────┬───────────────┘
              │ search queries
              ▼
┌─────────────────────────────┐
│   Product API Layer         │  → SerpAPI Google Shopping (primary)
│   • Multi-query retrieval   │  → SerpAPI Amazon engine (fallback)
│   • Dedup + normalize       │  → outputs: candidate pool (20-50 products)
└─────────────┬───────────────┘
              │ candidate pool
              ▼
┌─────────────────────────────┐
│   Reranker Agent            │  → reads user profile from KV
│   (Claude Sonnet)           │  → scores each candidate and generate rationale against user profile
│   • Profile-grounded score  │  → outputs: top-K (≤5) with reasons
│   • Reason generation       │  → null product if top score < threshold
└─────────────┬───────────────┘
              │ ranked results
              ▼
┌─────────────────────────────┐
│   UI Layer (Next.js)        │  → product cards + decision buttons
│   • Product cards           │  → constraint chips (editable)
│   • Accept / Similar /      │  → feedback follow-up prompts
│     Reject All buttons      │
└─────────────┬───────────────┘
              │ user decision + feedback
              ▼
┌─────────────────────────────┐
│   Profile Update Agent      │  → runs after session end
│   (Claude Sonnet)           │  → updates JSON profile in Vercel KV
│   • Reinforce accepted attrs│  → logs full session tuple to Supabase
│   • Update anti-preferences │
└─────────────────────────────┘
```

## Data Flow Details

### User Profile Schema (Vercel KV)

```json
{
  "userId": "session_xxx",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "profile": {
    "budgetRanges": {
      "default": { "min": 0, "max": 150 },
      "electronics": { "min": 0, "max": 500 }
    },
    "priorityAttributes": ["durability", "brand_neutrality"],
    "antiPreferences": {
      "brands": ["BrandX"],
      "materials": ["plastic"],
      "formFactors": []
    },
    "pastSignals": [
      { "attribute": "durability", "weight": 1.2, "source": "accepted_product" }
    ]
  },
  "sessionCount": 3
}
```

### Session Log Schema (Supabase)

```json
{
  "sessionId": "uuid",
  "userId": "session_xxx",
  "timestamp": "ISO",
  "intent": "raw user input",
  "clarifications": [{ "question": "...", "answer": "..." }],
  "generatedQueries": ["query1", "query2"],
  "candidatePool": [{ "productId": "...", "title": "...", "price": 0 }],
  "rankedResults": [{ "productId": "...", "score": 0.85, "reason": "..." }],
  "userDecision": "accept | suggest_similar | reject_all",
  "acceptedProductId": "...",
  "feedbackTags": ["price", "quality"],
  "feedbackText": "...",
  "profileBefore": {},
  "profileAfter": {}
}
```

## Module Structure

```
/app
  /api
    /chat          → Intent agent endpoint (GPT-4o)
    /search        → Product API calls + dedup
    /rerank        → Reranker agent endpoint (Claude Sonnet)
    /profile
      /get         → Fetch user profile from KV
      /update      → Profile update agent (Claude Sonnet)
    /log           → Session logging to Supabase
  /onboarding      → First-session profile collection UI
  /(chat)          → Main chat interface
  /components
    ProductCard.tsx
    ConstraintChip.tsx
    DecisionButtons.tsx
    FeedbackModal.tsx
    NullProductState.tsx
/lib
  /agents
    intentAgent.ts     → GPT-4o prompt + tool definitions
    rerankerAgent.ts   → Claude Sonnet prompt + scoring logic + rationale generation
    profileAgent.ts    → Profile update prompt
  /api
    serpApi.ts         → SerpAPI wrapper (Google Shopping + Amazon engines)
  /db
    kv.ts              → Vercel KV helpers
    supabase.ts        → Supabase client + logging helpers
  /types
    profile.ts
    session.ts
    product.ts
```

## API Endpoints


| Endpoint              | Method | Purpose                                         |
| --------------------- | ------ | ----------------------------------------------- |
| `/api/chat`           | POST   | Send message, get intent + clarifying questions |
| `/api/search`         | POST   | Execute queries, return candidate pool          |
| `/api/rerank`         | POST   | Score candidates against profile, return top-K  |
| `/api/profile/get`    | GET    | Fetch profile by userId                         |
| `/api/profile/update` | POST   | Update profile after session                    |
| `/api/log`            | POST   | Write session tuple to Supabase                 |


## Environment Variables

```
OPENAI_API_KEY= 
ANTHROPIC_API_KEY=
SERPAPI_KEY=
KV_REST_API_URL=
KV_REST_API_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_KEY=
CONFIDENCE_THRESHOLD=0.6
```

