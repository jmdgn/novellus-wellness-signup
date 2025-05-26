import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextLabel = "Next step",
  nextDisabled = false,
  isSubmitting = false
}: FormNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="form-button-outline flex items-center space-x-2"
        >
          <ChevronLeft size={16} />
        </button>
      ) : (
        <div />
      )}
      
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
      </div>
      
      {onNext && (
        <button 
          type="button"
          onClick={onNext}
          disabled={nextDisabled || isSubmitting}
          className="form-button"
        >
          {isSubmitting ? "Processing..." : nextLabel}
        </button>
      )}
    </div>
  );
}
