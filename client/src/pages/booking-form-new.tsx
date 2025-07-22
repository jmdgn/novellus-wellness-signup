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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header Container */}
      <div className="w-full border-b-2 border-[#eee] h-[280px] flex items-start justify-start">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <svg width="117" height="40" viewBox="0 0 117 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_4321_3704)">
              <path d="M83.8072 39.24C83.5612 39.24 83.3257 39.2055 83.1007 39.1365C82.8757 39.0645 82.6972 38.973 82.5652 38.862L82.7677 38.4075C82.8937 38.5065 83.0497 38.589 83.2357 38.655C83.4217 38.721 83.6122 38.754 83.8072 38.754C83.9722 38.754 84.1057 38.736 84.2077 38.7C84.3097 38.664 84.3847 38.616 84.4327 38.556C84.4807 38.493 84.5047 38.4225 84.5047 38.3445C84.5047 38.2485 84.4702 38.172 84.4012 38.115C84.3322 38.055 84.2422 38.0085 84.1312 37.9755C84.0232 37.9395 83.9017 37.9065 83.7667 37.8765C83.6347 37.8465 83.5012 37.812 83.3662 37.773C83.2342 37.731 83.1127 37.6785 83.0017 37.6155C82.8937 37.5495 82.8052 37.4625 82.7362 37.3545C82.6672 37.2465 82.6327 37.1085 82.6327 36.9405C82.6327 36.7695 82.6777 36.6135 82.7677 36.4725C82.8607 36.3285 83.0002 36.2145 83.1862 36.1305C83.3752 36.0435 83.6137 36 83.9017 36C84.0907 36 84.2782 36.024 84.4642 36.072C84.6502 36.12 84.8122 36.189 84.9502 36.279L84.7657 36.7335C84.6247 36.6495 84.4792 36.588 84.3292 36.549C84.1792 36.507 84.0352 36.486 83.8972 36.486C83.7352 36.486 83.6032 36.5055 83.5012 36.5445C83.4022 36.5835 83.3287 36.6345 83.2807 36.6975C83.2357 36.7605 83.2132 36.8325 83.2132 36.9135C83.2132 37.0095 83.2462 37.0875 83.3122 37.1475C83.3812 37.2045 83.4697 37.2495 83.5777 37.2825C83.6887 37.3155 83.8117 37.3485 83.9467 37.3815C84.0817 37.4115 84.2152 37.446 84.3472 37.485C84.4822 37.524 84.6037 37.575 84.7117 37.638C84.8227 37.701 84.9112 37.7865 84.9772 37.8945C85.0462 38.0025 85.0807 38.139 85.0807 38.304C85.0807 38.472 85.0342 38.628 84.9412 38.772C84.8512 38.913 84.7117 39.027 84.5227 39.114C84.3337 39.198 84.0952 39.24 83.8072 39.24Z" fill="black"/>
              <path d="M76.252 39.24C76.006 39.24 75.7705 39.2055 75.5455 39.1365C75.3205 39.0645 75.142 38.973 75.01 38.862L75.2125 38.4075C75.3385 38.5065 75.4945 38.589 75.6805 38.655C75.8665 38.721 76.057 38.754 76.252 38.754C76.417 38.754 76.5505 38.736 76.6525 38.7C76.7545 38.664 76.8295 38.616 76.8775 38.556C76.9255 38.493 76.9495 38.4225 76.9495 38.3445C76.9495 38.2485 76.915 38.172 76.846 38.115C76.777 38.055 76.687 38.0085 76.576 37.9755C76.468 37.9395 76.3465 37.9065 76.2115 37.8765C76.0795 37.8465 75.946 37.812 75.811 37.773C75.679 37.731 75.5575 37.6785 75.4465 37.6155C75.3385 37.5495 75.25 37.4625 75.181 37.3545C75.112 37.2465 75.0775 37.1085 75.0775 36.9405C75.0775 36.7695 75.1225 36.6135 75.2125 36.4725C75.3055 36.3285 75.445 36.2145 75.631 36.1305C75.82 36.0435 76.0585 36 76.3465 36C76.5355 36 76.723 36.024 76.909 36.072C77.095 36.12 77.257 36.189 77.395 36.279L77.2105 36.7335C77.0695 36.6495 76.924 36.588 76.774 36.549C76.624 36.507 76.48 36.486 76.342 36.486C76.18 36.486 76.048 36.5055 75.946 36.5445C75.847 36.5835 75.7735 36.6345 75.7255 36.6975C75.6805 36.7605 75.658 36.8325 75.658 36.9135C75.658 37.0095 75.691 37.0875 75.757 37.1475C75.826 37.2045 75.9145 37.2495 76.0225 37.2825C76.1335 37.3155 76.2565 37.3485 76.3915 37.3815C76.5265 37.4115 76.66 37.446 76.792 37.485C76.927 37.524 77.0485 37.575 77.1565 37.638C77.2675 37.701 77.356 37.7865 77.422 37.8945C77.491 38.0025 77.5255 38.139 77.5255 38.304C77.5255 38.472 77.479 38.628 77.386 38.772C77.296 38.913 77.1565 39.027 76.9675 39.114C76.7785 39.198 76.54 39.24 76.252 39.24Z" fill="black"/>
            </g>
            <defs>
              <clipPath id="clip0_4321_3704">
                <rect width="117" height="39.5166" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Header Content */}
        <div className="flex items-start gap-8 w-full max-w-[1200px] mx-auto pt-16 px-8">
          {/* Profile Image */}
          <div className="bg-[#f5f5f5] rounded-lg flex items-center justify-end h-[100px] overflow-hidden">
            <img 
              src="https://signup.novellus.net.au/static/media/profile-img.f5ef5de6cb4d654bc3cb.png" 
              alt="Beatriz Durango"
              className="w-[140px] h-[140px] object-cover"
            />
          </div>

          {/* Text Group */}
          <div className="flex flex-col gap-4 flex-1">
            <h1 className="text-[32px] font-normal leading-9 tracking-[-0.32px] text-black">
              Try Novellus Pilates with Beatriz Durango
            </h1>
            <p className="text-[14px] font-normal leading-5 tracking-[0.14px] text-[#777] underline flex-1">
              Book your 2x 1-hour introduction Pilates classes for $30 AUD. Select Fridays only.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-16">
            {Array.from({ length: 4 }, (_, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-start gap-2">
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`w-[10px] h-[10px] rounded-full ${
                      isActive || isCompleted ? 'bg-black' : 'bg-[#55555533]'
                    }`} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-[16px] font-semibold leading-6 ${
                        isActive ? 'text-black' : 'text-[#5555554d]'
                      }`}>
                        Step {stepNumber}
                      </span>
                    </div>
                    <span className={`text-[14px] font-normal leading-[18px] ${
                      isActive ? 'text-black' : 'text-[#5555554d]'
                    }`}>
                      {stepTitles[index]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center gap-16 pt-16 pb-32">
        {/* Form Container */}
        <div className="flex flex-col gap-24 w-full max-w-[910px]">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}