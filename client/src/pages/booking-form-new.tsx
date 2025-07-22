import { useState } from "react";
import TimePreferencesStep from "@/components/form-steps/time-preferences-step-new";
import ContactStep from "@/components/form-steps/contact-step";
import MedicalDeclarationStep from "@/components/form-steps/medical-declaration-step";
import PaymentStep from "@/components/form-steps/payment-step";
import type { ContactInfo, TimePreferences, MedicalDeclaration } from "@shared/schema";

interface FormData {
  contact: Partial<ContactInfo>;
  timePreferences: Partial<TimePreferences>;
  medical: Partial<MedicalDeclaration>;
  payment: {
    agreeToTerms: boolean;
  };
}

interface BookingFormProps {}

export default function BookingForm({}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    contact: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
    timePreferences: [],
    medical: {
      painAreas: [],
      hasInjuries: false,
      injuryDetails: "",
      hasMedicalConditions: false,
      medicalConditions: "",
      isPregnant: false,
      agreeToTerms: false,
    },
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev: FormData) => ({ ...prev, ...newData }));
  };

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

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      // Submit booking logic here
      console.log("Submitting booking:", formData);
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TimePreferencesStep
            data={formData.timePreferences}
            onUpdate={(data: any) => updateFormData({ timePreferences: data })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ContactStep
            data={formData.contact}
            onUpdate={(data: any) => updateFormData({ contact: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <MedicalDeclarationStep
            data={formData.medical}
            onUpdate={(data: any) => updateFormData({ medical: data })}
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

  const stepTitles = [
    "Select Date & Time",
    "Contact Details", 
    "Medical Declaration",
    "Payment"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="header-outer fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="header-container-inner max-w-6xl mx-auto p-6">
          <div className="headContainer-top flex items-center justify-between mb-6">
            <div className="logoContainer">
              <svg width="117" height="40" viewBox="0 0 117 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_4321_3704)">
                  <path d="M83.8072 39.24C83.5612 39.24 83.3257 39.2055 83.1007 39.1365C82.8757 39.0645 82.6972 38.973 82.5652 38.862L82.7677 38.4075C82.8937 38.5065 83.0497 38.589 83.2357 38.655C83.4217 38.721 83.6122 38.754 83.8072 38.754C83.9722 38.754 84.1057 38.736 84.2077 38.7C84.3097 38.664 84.3847 38.616 84.4327 38.556C84.4807 38.493 84.5047 38.4225 84.5047 38.343C84.5047 38.2635 84.4807 38.193 84.4327 38.1315C84.3847 38.07 84.3097 38.022 84.2077 37.986C84.1057 37.95 83.9722 37.932 83.8072 37.932H83.5612V37.446H83.8072C83.9932 37.446 84.1507 37.4265 84.2797 37.3875C84.4087 37.3485 84.5077 37.2915 84.5767 37.2165C84.6457 37.1415 84.6802 37.05 84.6802 36.942C84.6802 36.834 84.6457 36.7425 84.5767 36.6675C84.5077 36.5925 84.4087 36.5355 84.2797 36.4965C84.1507 36.4575 83.9932 36.438 83.8072 36.438C83.6212 36.438 83.4307 36.471 83.2357 36.537C83.0497 36.603 82.8937 36.6855 82.7677 36.7845L82.5652 36.33C82.6972 36.219 82.8757 36.1275 83.1007 36.0555C83.3257 35.9865 83.5612 35.952 83.8072 35.952C84.1027 35.952 84.3622 35.9985 84.5857 36.0915C84.8092 36.1845 84.9847 36.315 85.1122 36.483C85.2397 36.651 85.3035 36.8475 85.3035 37.0725C85.3035 37.236 85.2712 37.383 85.2067 37.5135C85.1422 37.644 85.0517 37.752 84.9352 37.8375C85.0877 37.914 85.2067 38.022 85.2922 38.1615C85.3777 38.301 85.4205 38.4615 85.4205 38.643C85.4205 38.877 85.3535 39.078 85.2195 39.246C85.0855 39.414 84.8977 39.543 84.6562 39.633C84.4147 39.723 84.1327 39.768 83.8102 39.768L83.8072 39.24Z" fill="black"/>
                  <path d="M75.8611 39.7065C75.5206 39.7065 75.2176 39.6345 74.9521 39.4905C74.6866 39.3465 74.4781 39.1425 74.3266 38.8785C74.1751 38.6145 74.0993 38.3055 74.0993 37.9515C74.0993 37.5975 74.1751 37.2885 74.3266 37.0245C74.4781 36.7605 74.6866 36.5565 74.9521 36.4125C75.2176 36.2685 75.5206 36.1965 75.8611 36.1965C76.2016 36.1965 76.5046 36.2685 76.7701 36.4125C77.0356 36.5565 77.2441 36.7605 77.3956 37.0245C77.5471 37.2885 77.6229 37.5975 77.6229 37.9515C77.6229 38.3055 77.5471 38.6145 77.3956 38.8785C77.2441 39.1425 77.0356 39.3465 76.7701 39.4905C76.5046 39.6345 76.2016 39.7065 75.8611 39.7065ZM75.8611 39.2205C76.0471 39.2205 76.2106 39.174 76.3516 39.081C76.4926 38.988 76.6036 38.8575 76.6846 38.6895C76.7656 38.5215 76.8061 38.327 76.8061 38.106C76.8061 37.885 76.7656 37.6905 76.6846 37.5225C76.6036 37.3545 76.4926 37.224 76.3516 37.131C76.2106 37.038 76.0471 36.9915 75.8611 36.9915C75.6751 36.9915 75.5116 37.038 75.3706 37.131C75.2296 37.224 75.1186 37.3545 75.0376 37.5225C74.9566 37.6905 74.9161 37.885 74.9161 38.106C74.9161 38.327 74.9566 38.5215 75.0376 38.6895C75.1186 38.8575 75.2296 38.988 75.3706 39.081C75.5116 39.174 75.6751 39.2205 75.8611 39.2205Z" fill="black"/>
                </g>
                <defs>
                  <clipPath id="clip0_4321_3704">
                    <rect width="117" height="40" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="progressContainer flex items-center gap-3">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? "bg-blue-600 text-white"
                        : step < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? "✓" : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step < currentStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="headContainer-bottom flex items-center justify-between">
            <div className="introContent-text">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                Try Novellus Pilates with Beatriz Durango
              </h1>
              <p className="text-gray-600 text-sm">
                Book your 2x 1hr introduction classes for $30 AUD
              </p>
            </div>
            <div className="introProfile-image">
              <div className="w-16 h-16 bg-pink-100 rounded-lg overflow-hidden">
                <img 
                  src="https://signup.novellus.net.au/static/media/profile-img.f5ef5de6cb4d654bc3cb.png" 
                  alt="Beatriz Durango"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with padding for fixed header */}
      <div className="flex-1 flex flex-col items-center gap-16 pt-48 pb-32">
        {/* Form Container */}
        <div className="flex flex-col gap-24 w-full max-w-[910px]">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}