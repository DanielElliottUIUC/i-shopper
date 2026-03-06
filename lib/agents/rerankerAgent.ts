import Anthropic from "@anthropic-ai/sdk";
import type { Product, RerankerOutput } from "@/lib/types/product";
import type { UserProfile } from "@/lib/types/profile";
import type { DetectedConstraint } from "@/lib/types/session";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";
const MAX_RESULTS = 5;

function getConfidenceThreshold(): number {
  return parseFloat(process.env.CONFIDENCE_THRESHOLD ?? "0.6");
}

function buildSystemPrompt(
  userProfile: UserProfile | null,
  constraints: DetectedConstraint[],
  threshold: number
): string {
  const profileSection = userProfile
    ? `User profile (verbatim — ground all scoring against this):\n${JSON.stringify(userProfile.profile, null, 2)}`
    : "No user profile available. Score based on general product quality and the detected constraints only.";

  const constraintSection =
    constraints.length > 0
      ? `\nSession constraints detected by the intent agent:\n${JSON.stringify(constraints, null, 2)}`
      : "";

  return `You are a personalized product ranker.

${profileSection}${constraintSection}

Scoring rules:
- Score each product 0.0–1.0 based on how well it matches the user profile and session constraints.
- Score reflects profile match, NOT just product quality.
- If nullProduct is false, return the top ${MAX_RESULTS} products ordered by score descending.
- If the highest score across all candidates is below ${threshold}, set nullProduct=true and return an empty results array.
- Each reason must be exactly 1 line, ≤ 15 words, profile-grounded (not generic marketing copy).
- matchedAttributes must list the profile attributes that drove the score.
- Never hallucinate product attributes not present in rawAttributes.

Return valid JSON only, no markdown, no explanation.

Output schema:
{
  "nullProduct": boolean,
  "results": [
    {
      "productId": string,
      "score": number,
      "reason": string,
      "matchedAttributes": [string]
    }
  ]
}`;
}

function buildUserMessage(candidates: Product[]): string {
  const slim = candidates.map((p) => ({
    productId: p.id,
    title: p.title,
    price: p.price,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.reviewCount,
    source: p.source,
    rawAttributes: p.rawAttributes,
  }));
  return `Score and rank these ${candidates.length} products:\n\n${JSON.stringify(slim, null, 2)}`;
}

export async function runRerankerAgent(
  candidates: Product[],
  userProfile: UserProfile | null,
  constraints: DetectedConstraint[]
): Promise<RerankerOutput> {
  if (candidates.length === 0) {
    return { nullProduct: true, results: [] };
  }

  const threshold = getConfidenceThreshold();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: buildSystemPrompt(userProfile, constraints, threshold),
    messages: [{ role: "user", content: buildUserMessage(candidates) }],
  });

  const raw =
    response.content[0]?.type === "text" ? response.content[0].text : null;
  if (!raw) throw new Error("Reranker agent returned empty response");

  const parsed = JSON.parse(raw) as RerankerOutput;

  // Enforce K ≤ 5 hard limit regardless of model output
  if (parsed.results.length > MAX_RESULTS) {
    parsed.results = parsed.results.slice(0, MAX_RESULTS);
  }

  // Enforce null product rule
  const topScore = parsed.results[0]?.score ?? 0;
  if (!parsed.nullProduct && topScore < threshold) {
    parsed.nullProduct = true;
    parsed.results = [];
  }

  return parsed;
}
