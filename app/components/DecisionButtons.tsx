"use client";

import type { UserDecision } from "@/lib/types/session";

interface DecisionButtonsProps {
  onDecide: (decision: UserDecision) => void;
  /** Accept requires a product to be selected first. */
  selectedProductId: string | null;
}

export function DecisionButtons({
  onDecide,
  selectedProductId,
}: DecisionButtonsProps) {
  return (
    <div>
      <div className="decisionRow">
        <button
          className="btnAccept"
          onClick={() => onDecide("accept")}
          disabled={!selectedProductId}
        >
          ✓ Accept
        </button>
        <button className="btnSimilar" onClick={() => onDecide("suggest_similar")}>
          ↻ Suggest Similar
        </button>
        <button className="btnReject" onClick={() => onDecide("reject_all")}>
          ✕ Reject All
        </button>
      </div>
      {!selectedProductId && (
        <p className="selectHint">Tap a card above to select a product, then Accept</p>
      )}
    </div>
  );
}
