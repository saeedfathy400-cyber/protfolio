import React, { useState } from "react";
import { LightTheme, DarkTheme, ThemeMode } from "@/constants/design-tokens.constants";

export interface WizardStep {
  key: string;
  label: string;
  content: React.ReactNode;
  /** Return an error message to block moving to the next step, or null if valid. */
  validate?: () => string | null;
}

export interface WizardProps {
  theme: ThemeMode;
  steps: WizardStep[];
  onComplete: () => void;
  completeLabel?: string;
}

/**
 * Generic step-form shell. Introduced in this sprint for the Social Research
 * form (Income → Expenses → Housing → Health → Education → Recommendation),
 * but written generically so Sprint 6 (Donation Campaign wizard) and any
 * future multi-step form reuse it instead of duplicating stepper logic.
 */
export function Wizard({ theme, steps, onComplete, completeLabel = "إرسال" }: WizardProps): JSX.Element {
  const tokens = theme === "dark" ? DarkTheme : LightTheme;
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isLastStep = activeIndex === steps.length - 1;

  function goNext(): void {
    const currentStep = steps[activeIndex];
    const validationError = currentStep.validate?.() ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (isLastStep) {
      onComplete();
    } else {
      setActiveIndex((index) => index + 1);
    }
  }

  function goBack(): void {
    setError(null);
    setActiveIndex((index) => Math.max(0, index - 1));
  }

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex items-center gap-2 overflow-x-auto" aria-label="خطوات النموذج">
        {steps.map((step, index) => (
          <li key={step.key} className="flex items-center gap-2 flex-shrink-0">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: index <= activeIndex ? tokens.primary : tokens.border,
                color: index <= activeIndex ? "#fff" : tokens.textSecondary,
              }}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              {index + 1}
            </span>
            <span className="text-xs font-medium" style={{ color: index === activeIndex ? tokens.textPrimary : tokens.textSecondary }}>
              {step.label}
            </span>
            {index < steps.length - 1 && <span className="w-6 h-px" style={{ background: tokens.border }} />}
          </li>
        ))}
      </ol>

      <div>{steps[activeIndex].content}</div>

      {error && (
        <p role="alert" className="text-sm font-medium" style={{ color: tokens.danger }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${tokens.border}` }}>
        <button
          type="button"
          onClick={goBack}
          disabled={activeIndex === 0}
          className="h-11 px-5 rounded-xl text-sm font-semibold disabled:opacity-40"
          style={{ border: `1px solid ${tokens.border}`, color: tokens.textPrimary }}
        >
          السابق
        </button>
        <button
          type="button"
          onClick={goNext}
          className="h-11 px-5 rounded-xl text-sm font-semibold text-white"
          style={{ background: tokens.primary }}
        >
          {isLastStep ? completeLabel : "التالي"}
        </button>
      </div>
    </div>
  );
}
