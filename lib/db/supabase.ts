import { createClient } from "@supabase/supabase-js";
import type { SessionLog } from "@/lib/types/session";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key);
}

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 300;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) =>
          setTimeout(r, RETRY_BASE_MS * Math.pow(2, attempt))
        );
      }
    }
  }
  throw lastError;
}

export async function logSession(session: SessionLog): Promise<void> {
  await withRetry(async () => {
    const { error } = await getClient()
      .from("session_logs")
      .insert({
        session_id: session.sessionId,
        user_id: session.userId,
        timestamp: session.timestamp,
        intent: session.intent,
        clarifications: session.clarifications,
        generated_queries: session.generatedQueries,
        candidate_pool: session.candidatePool,
        ranked_results: session.rankedResults,
        user_decision: session.userDecision,
        accepted_product_id: session.acceptedProductId,
        feedback_tags: session.feedbackTags,
        feedback_text: session.feedbackText,
        profile_before: session.profileBefore,
        profile_after: session.profileAfter,
      });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  });
}

export async function updateSessionDecision(
  sessionId: string,
  patch: Partial<
    Pick<
      SessionLog,
      | "userDecision"
      | "acceptedProductId"
      | "feedbackTags"
      | "feedbackText"
      | "profileAfter"
    >
  >
): Promise<void> {
  await withRetry(async () => {
    const { error } = await getClient()
      .from("session_logs")
      .update({
        user_decision: patch.userDecision,
        accepted_product_id: patch.acceptedProductId,
        feedback_tags: patch.feedbackTags,
        feedback_text: patch.feedbackText,
        profile_after: patch.profileAfter,
      })
      .eq("session_id", sessionId);
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
  });
}
