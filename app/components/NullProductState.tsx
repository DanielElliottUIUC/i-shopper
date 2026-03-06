"use client";

interface NullProductStateProps {
  onRefine: () => void;
  onShowAnyway: () => void;
}

export function NullProductState({ onRefine, onShowAnyway }: NullProductStateProps) {
  return (
    <div className="nullBox">
      <p className="nullTitle">I&apos;m not confident enough to recommend yet</p>
      <p className="nullDesc">
        The products I found don&apos;t match your needs well enough for me to feel
        good recommending them. You can refine your request, or see the best
        available options anyway.
      </p>
      <div className="nullActions">
        <button className="btnNullPrimary" onClick={onRefine}>
          Refine your request
        </button>
        <button className="btnNullSecondary" onClick={onShowAnyway}>
          See best available anyway
        </button>
      </div>
    </div>
  );
}
