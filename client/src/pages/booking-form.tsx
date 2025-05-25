import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingForm } from "@/hooks/use-booking-form";
import ContactStep from "@/components/form-steps/contact-step";
import TimePreferencesStep from "@/components/form-steps/time-preferences-step";
import MedicalDeclarationStep from "@/components/form-steps/medical-declaration-step";
import PaymentStep from "@/components/form-steps/payment-step";
import FormNavigation from "@/components/form-navigation";

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, updateFormData, submitBooking, isSubmitting } = useBookingForm();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContactStep
            data={formData.contact}
            onUpdate={(data) => updateFormData({ contact: data })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TimePreferencesStep
            data={formData.timePreferences}
            onUpdate={(data) => updateFormData({ timePreferences: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <MedicalDeclarationStep
            data={formData.medical}
            onUpdate={(data) => updateFormData({ medical: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <PaymentStep
            formData={formData}
            onPrevious={handlePrevious}
            submitBooking={submitBooking}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ocean-gradient">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'cursive' }}>
          Pirouette
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-lg">
        <Card className="form-card p-8 relative">
          <CardContent className="p-0">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-white rounded-full h-2 progress-bar" 
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
