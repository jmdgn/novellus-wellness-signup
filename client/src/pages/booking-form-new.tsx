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
      phoneNumber: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      language: "english" as "english" | "spanish",
    },
    timePreferences: {
      selectedDate: "",
      timePreferences: [],
      classType: "semi-private" as "semi-private" | "private",
      language: "english" as "english" | "spanish",
    },
    medical: {
      painAreas: [],
      isPregnant: false,
      pregnancyWeeks: undefined,
      // Questions 2-8 are undefined initially so they appear unselected
      heartCondition: undefined,
      chestPain: undefined,
      dizziness: undefined,
      asthmaAttack: undefined,
      diabetesControl: undefined,
      otherConditions: undefined,
      medicalConditions: "",
      hasMedicalConditions: false,
    },
    payment: {
      agreedToTerms: false,
      totalAmount: 3000,
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

  const submitBooking = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      console.log("📝 Creating booking...");
      console.log("Submitting booking:", bookingData);
      
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const booking = await response.json();
      console.log("✅ Booking created:", booking);
      return booking;
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      throw error;
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
      <div className="header-outer fixed top-0 left-0 right-0 bg-white z-50" style={{ borderBottom: '2px solid #eee' }}>
        <div className="header-container-inner w-full flex flex-col justify-center items-center relative px-4 py-6 md:p-8">
          
          {/* Logo */}
          <div className="logoContainer absolute top-4 left-4 md:top-6 md:left-6 w-[100px] h-[34px] md:w-[130px] md:h-[44px] overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 130 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M93.1193 43.6C92.8459 43.6 92.5843 43.5617 92.3343 43.485C92.0843 43.405 91.8859 43.3033 91.7393 43.18L91.9643 42.675C92.1043 42.785 92.2776 42.8767 92.4843 42.95C92.6909 43.0233 92.9026 43.06 93.1193 43.06C93.3026 43.06 93.4509 43.04 93.5643 43C93.6776 42.96 93.7609 42.9067 93.8143 42.84C93.8676 42.77 93.8943 42.6917 93.8943 42.605C93.8943 42.4983 93.8559 42.4133 93.7793 42.35C93.7026 42.2833 93.6026 42.2317 93.4793 42.195C93.3593 42.155 93.2243 42.1183 93.0793 42.0817C92.9343 42.0417 92.7876 42.005 92.6393 41.9717C92.4943 41.935 92.3593 41.8867 92.2343 41.8267C92.1126 41.7633 92.0143 41.6767 91.9393 41.567C91.8676 41.4533 91.8293 41.31 91.8293 41.137C91.8293 40.96 91.8809 40.7983 91.9843 40.652C92.0909 40.5017 92.2509 40.38 92.4643 40.287C92.6809 40.1907 92.9526 40.142 93.2793 40.142C93.4993 40.142 93.7176 40.1687 93.9343 40.222C94.1509 40.2753 94.3426 40.3517 94.5093 40.451L94.3043 40.947C94.1409 40.8553 93.9726 40.7837 93.7993 40.7323C93.6259 40.6777 93.4576 40.6503 93.2943 40.6503C93.1076 40.6503 92.9593 40.6737 92.8493 40.7203C92.7426 40.7637 92.6643 40.8203 92.6143 40.89C92.5676 40.9597 92.5443 41.038 92.5443 41.125C92.5443 41.2283 92.5809 41.3133 92.6543 41.38C92.7309 41.443 92.8293 41.4947 92.9493 41.535C93.0726 41.575 93.2076 41.6133 93.3543 41.65C93.5043 41.683 93.6526 41.7213 93.7993 41.765C93.9493 41.8087 94.0876 41.8653 94.2143 41.935C94.3443 42.0047 94.4493 42.0963 94.5293 42.21C94.6126 42.3237 94.6543 42.4697 94.6543 42.648C94.6543 42.8293 94.5993 42.996 94.4893 43.148C94.3826 43.297 94.2176 43.416 93.9943 43.505C93.7709 43.591 93.4876 43.634 93.1443 43.634L93.1193 43.6Z" fill="black"/>
              <path d="M84.7247 43.6C84.4514 43.6 84.1897 43.5617 83.9397 43.485C83.6897 43.405 83.4914 43.3033 83.3447 43.18L83.5697 42.675C83.7097 42.785 83.8831 42.8767 84.0897 42.95C84.2964 43.0233 84.5081 43.06 84.7247 43.06C84.9081 43.06 85.0564 43.04 85.1697 43C85.2831 42.96 85.3664 42.9067 85.4197 42.84C85.4731 42.77 85.4997 42.6917 85.4997 42.605C85.4997 42.4983 85.4614 42.4133 85.3847 42.35C85.3081 42.2833 85.2081 42.2317 85.0847 42.195C84.9647 42.155 84.8297 42.1183 84.6847 42.0817C84.5397 42.0417 84.3931 42.005 84.2447 41.9717C84.0997 41.935 83.9647 41.8867 83.8397 41.8267C83.7181 41.7633 83.6197 41.6767 83.5447 41.567C83.4731 41.4533 83.4347 41.31 83.4347 41.137C83.4347 40.96 83.4864 40.7983 83.5897 40.652C83.6964 40.5017 83.8564 40.38 84.0697 40.287C84.2864 40.1907 84.5581 40.142 84.8847 40.142C85.1047 40.142 85.3231 40.1687 85.5397 40.222C85.7564 40.2753 85.9481 40.3517 86.1147 40.451L85.9097 40.947C85.7464 40.8553 85.5781 40.7837 85.4047 40.7323C85.2314 40.6777 85.0631 40.6503 84.8997 40.6503C84.7131 40.6503 84.5647 40.6737 84.4547 40.7203C84.3481 40.7637 84.2697 40.8203 84.2197 40.89C84.1731 40.9597 84.1497 41.038 84.1497 41.125C84.1497 41.2283 84.1864 41.3133 84.2597 41.38C84.3364 41.443 84.4347 41.4947 84.5547 41.535C84.6781 41.575 84.8131 41.6133 84.9597 41.65C85.1097 41.683 85.2581 41.7213 85.4047 41.765C85.5547 41.8087 85.6931 41.8653 85.8197 41.935C85.9497 42.0047 86.0547 42.0963 86.1347 42.21C86.2181 42.3237 86.2597 42.4697 86.2597 42.648C86.2597 42.8293 86.2047 42.996 86.0947 43.148C85.9881 43.297 85.8231 43.416 85.5997 43.505C85.3764 43.591 85.0931 43.634 84.7497 43.634L84.7247 43.6Z" fill="black"/>
            </svg>
          </div>

          {/* Step Progress Container - Mobile: Circles, Desktop: Full */}
          <div className="step-progress-container w-full max-w-[820px] mx-auto mb-4 md:max-w-[820px] md:w-full md:mx-auto" style={{ maxWidth: '50%', width: '50%', marginRight: '0', marginLeft: 'auto' }}>
            {/* Mobile Step Progress - Circles Only */}
            <div className="md:hidden flex items-center justify-center gap-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep === stepNum 
                        ? 'bg-black text-white' 
                        : 'bg-[#5555554d] text-white'
                    }`}
                  >
                    {stepNum}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Step Progress - Full Text */}
            <div className="hidden md:flex items-center justify-between">
              {[
                { number: 1, title: "Select Date & Time", active: currentStep === 1 },
                { number: 2, title: "Contact Details", active: currentStep === 2 },
                { number: 3, title: "Medical Declaration", active: currentStep === 3 },
                { number: 4, title: "Payment", active: currentStep === 4 }
              ].map((step) => (
                <div key={step.number} className="flex items-start gap-2">
                  <div className="flex items-center gap-[10px] pt-2">
                    <div 
                      className={`w-[10px] h-[10px] rounded-full ${
                        step.active ? 'bg-black' : 'bg-[#5555554d]'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-[10px]">
                      <span 
                        className={`text-[16px] font-semibold leading-6 ${
                          step.active ? 'text-black' : 'text-[#5555554d]'
                        }`}
                      >
                        Step {step.number}
                      </span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <span 
                        className={`text-[12px] font-normal leading-[18px] ${
                          step.active ? 'text-black' : 'text-[#5555554d]'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text and Image Container - Bottom */}
          <div className="text-image-container w-full max-w-[820px] mx-auto flex items-center justify-between mt-4 gap-8">
            {/* Text Group - Responsive */}
            <div className="introContent-text flex flex-col items-start gap-4 flex-1">
              <div className="flex items-center gap-[10px]">
                <h1 className="text-black text-[20px] md:text-[24px] font-semibold leading-7 md:leading-9 tracking-[-0.32px]">
                  Try Novellus Pilates with Beatriz Durango
                </h1>
              </div>
              <div className="flex items-center gap-[10px] w-full">
                <p className="text-[#777] text-[13px] md:text-[14px] font-normal leading-4 md:leading-5 tracking-[0.14px]">
                  Book your 2x 1-hour introduction classes at{' '}
                  <a 
                    href="https://maps.app.goo.gl/3Yg6bq7YMTcLztVW8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    316-320 Toorak Road, South Yarra
                  </a>
                  {' '}for just $30. A special rate to experience semi-private pilates in our boutique studio. One-time payment, no subscription required.
                </p>
              </div>
            </div>

            {/* Profile Image - Hidden on Mobile */}
            <div className="hidden md:flex introProfile-image bg-[#f5f5f5] rounded-lg items-center justify-center h-[100px] w-[100px] overflow-hidden flex-shrink-0">
              <img 
                src="https://signup.novellus.net.au/static/media/profile-img.f5ef5de6cb4d654bc3cb.png" 
                alt="Beatriz Durango"
                className="w-[100px] h-[100px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with padding for fixed header */}
      <div className="flex-1 flex flex-col items-center gap-4 pb-32" style={{ paddingTop: '320px' }}>
        {/* Form Container */}
        <div className="flex flex-col gap-4 w-full max-w-[820px] px-4 md:px-0">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}