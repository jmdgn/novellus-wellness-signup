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
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
        >
          <ChevronLeft size={16} />
        </Button>
      ) : (
        <div />
      )}
      
      <div className="step-indicator">
        Step {currentStep} of {totalSteps}
      </div>
      
      {onNext && (
        <Button 
          type="button"
          onClick={onNext}
          disabled={nextDisabled || isSubmitting}
          className="bg-primary hover:bg-primary/90 px-6 py-3"
        >
          {isSubmitting ? "Processing..." : nextLabel}
        </Button>
      )}
    </div>
  );
}
