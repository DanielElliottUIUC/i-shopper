"use client";

import type { DetectedConstraint } from "@/lib/types/session";

interface ConstraintChipProps {
  constraint: DetectedConstraint;
  onRemove: (constraint: DetectedConstraint) => void;
}

export function ConstraintChip({ constraint, onRemove }: ConstraintChipProps) {
  return (
    <span className="chip">
      <span>
        {constraint.type}: {constraint.value}
      </span>
      <button
        className="chipX"
        onClick={() => onRemove(constraint)}
        aria-label={`Remove constraint: ${constraint.value}`}
      >
        ×
      </button>
    </span>
  );
}
