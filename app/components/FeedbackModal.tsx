"use client";

import { useState } from "react";
import type { UserDecision, FeedbackTag } from "@/lib/types/session";

const TAGS: Record<UserDecision, { value: FeedbackTag; label: string }[]> = {
  accept: [
    { value: "price", label: "Good price" },
    { value: "quality", label: "Quality" },
    { value: "brand", label: "Brand" },
    { value: "reviews", label: "Reviews" },
    { value: "spec", label: "Specs match" },
  ],
  suggest_similar: [
    { value: "price", label: "Too expensive" },
    { value: "brand", label: "Wrong brand" },
    { value: "style", label: "Different style" },
    { value: "spec", label: "Wrong spec" },
  ],
  reject_all: [
    { value: "price", label: "Too expensive" },
    { value: "quality", label: "Wrong quality" },
    { value: "brand", label: "Wrong brand" },
    { value: "spec", label: "Wrong spec" },
    { value: "style", label: "Wrong style" },
  ],
};

const CONFIG: Record<UserDecision, { title: string; placeholder: string }> = {
  accept: {
    title: "What made you choose this?",
    placeholder: "Anything else you liked? (optional)",
  },
  suggest_similar: {
    title: "What would you change?",
    placeholder: "Tell us more (optional)",
  },
  reject_all: {
    title: "What was missing?",
    placeholder: "What would have made these better? (optional)",
  },
};

interface FeedbackModalProps {
  decision: UserDecision;
  open: boolean;
  onSubmit: (tags: FeedbackTag[], text: string) => void;
  onSkip: () => void;
}

export function FeedbackModal({
  decision,
  open,
  onSubmit,
  onSkip,
}: FeedbackModalProps) {
  const [selected, setSelected] = useState<FeedbackTag[]>([]);
  const [text, setText] = useState("");

  if (!open) return null;

  const { title, placeholder } = CONFIG[decision];
  const tags = TAGS[decision];

  function toggle(tag: FeedbackTag) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function submit() {
    onSubmit(selected, text);
    setSelected([]);
    setText("");
  }

  function skip() {
    setSelected([]);
    setText("");
    onSkip();
  }

  return (
    <div className="overlay" onClick={skip}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <p className="modalTitle">{title}</p>

        <div className="tagRow">
          {tags.map((t) => (
            <button
              key={t.value}
              className={`tagBtn${selected.includes(t.value) ? " on" : ""}`}
              onClick={() => toggle(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          className="feedbackText"
          rows={3}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="modalActions">
          <button className="btnSubmit" onClick={submit}>
            Submit feedback
          </button>
          <button className="btnModalSkip" onClick={skip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
