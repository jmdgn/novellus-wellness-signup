import { useState } from "react";
import TimePreferencesStep from "@/components/form-steps/time-preferences-step-new";
import ContactStep from "@/components/form-steps/contact-step";
import MedicalDeclarationStep from "@/components/form-steps/medical-declaration-step";
import PaymentStep from "@/components/form-steps/payment-step";
import type { ContactInfo, TimePreferences, MedicalDeclaration } from "@shared/schema";
import bdProfilePath from "@assets/bd-profile_1753224323951.png";

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
      // Scroll to top of screen when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of screen when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <svg viewBox="0 0 117 40" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4321_3704)"><path d="M83.8072 39.24C83.5612 39.24 83.3257 39.2055 83.1007 39.1365C82.8757 39.0645 82.6972 38.973 82.5652 38.862L82.7677 38.4075C82.8937 38.5065 83.0497 38.589 83.2357 38.655C83.4217 38.721 83.6122 38.754 83.8072 38.754C83.9722 38.754 84.1057 38.736 84.2077 38.7C84.3097 38.664 84.3847 38.616 84.4327 38.556C84.4807 38.493 84.5047 38.4225 84.5047 38.3445C84.5047 38.2485 84.4702 38.172 84.4012 38.115C84.3322 38.055 84.2422 38.0085 84.1312 37.9755C84.0232 37.9395 83.9017 37.9065 83.7667 37.8765C83.6347 37.8465 83.5012 37.812 83.3662 37.773C83.2342 37.731 83.1127 37.6785 83.0017 37.6155C82.8937 37.5495 82.8052 37.4625 82.7362 37.3545C82.6672 37.2465 82.6327 37.1085 82.6327 36.9405C82.6327 36.7695 82.6777 36.6135 82.7677 36.4725C82.8607 36.3285 83.0002 36.2145 83.1862 36.1305C83.3752 36.0435 83.6137 36 83.9017 36C84.0907 36 84.2782 36.024 84.4642 36.072C84.6502 36.12 84.8122 36.189 84.9502 36.279L84.7657 36.7335C84.6247 36.6495 84.4792 36.588 84.3292 36.549C84.1792 36.507 84.0352 36.486 83.8972 36.486C83.7352 36.486 83.6032 36.5055 83.5012 36.5445C83.4022 36.5835 83.3287 36.6345 83.2807 36.6975C83.2357 36.7605 83.2132 36.8325 83.2132 36.9135C83.2132 37.0095 83.2462 37.0875 83.3122 37.1475C83.3812 37.2045 83.4697 37.2495 83.5777 37.2825C83.6887 37.3155 83.8117 37.3485 83.9467 37.3815C84.0817 37.4115 84.2152 37.446 84.3472 37.485C84.4822 37.524 84.6037 37.575 84.7117 37.638C84.8227 37.701 84.9112 37.7865 84.9772 37.8945C85.0462 38.0025 85.0807 38.139 85.0807 38.304C85.0807 38.472 85.0342 38.628 84.9412 38.772C84.8512 38.913 84.7117 39.027 84.5227 39.114C84.3337 39.198 84.0952 39.24 83.8072 39.24Z" fill="black"></path><path d="M76.252 39.24C76.006 39.24 75.7705 39.2055 75.5455 39.1365C75.3205 39.0645 75.142 38.973 75.01 38.862L75.2125 38.4075C75.3385 38.5065 75.4945 38.589 75.6805 38.655C75.8665 38.721 76.057 38.754 76.252 38.754C76.417 38.754 76.5505 38.736 76.6525 38.7C76.7545 38.664 76.8295 38.616 76.8775 38.556C76.9255 38.493 76.9495 38.4225 76.9495 38.3445C76.9495 38.2485 76.915 38.172 76.846 38.115C76.777 38.055 76.687 38.0085 76.576 37.9755C76.468 37.9395 76.3465 37.9065 76.2115 37.8765C76.0795 37.8465 75.946 37.812 75.811 37.773C75.679 37.731 75.5575 37.6785 75.4465 37.6155C75.3385 37.5495 75.25 37.4625 75.181 37.3545C75.112 37.2465 75.0775 37.1085 75.0775 36.9405C75.0775 36.7695 75.1225 36.6135 75.2125 36.4725C75.3055 36.3285 75.445 36.2145 75.631 36.1305C75.82 36.0435 76.0585 36 76.3465 36C76.5355 36 76.723 36.024 76.909 36.072C77.095 36.12 77.257 36.189 77.395 36.279L77.2105 36.7335C77.0695 36.6495 76.924 36.588 76.774 36.549C76.624 36.507 76.48 36.486 76.342 36.486C76.18 36.486 76.048 36.5055 75.946 36.5445C75.847 36.5835 75.7735 36.6345 75.7255 36.6975C75.6805 36.7605 75.658 36.8325 75.658 36.9135C75.658 37.0095 75.691 37.0875 75.757 37.1475C75.826 37.2045 75.9145 37.2495 76.0225 37.2825C76.1335 37.3155 76.2565 37.3485 76.3915 37.3815C76.5265 37.4115 76.66 37.446 76.792 37.485C76.927 37.524 77.0485 37.575 77.1565 37.638C77.2675 37.701 77.356 37.7865 77.422 37.8945C77.491 38.0025 77.5255 38.139 77.5255 38.304C77.5255 38.472 77.479 38.628 77.386 38.772C77.296 38.913 77.1565 39.027 76.9675 39.114C76.7785 39.198 76.54 39.24 76.252 39.24Z" fill="black"></path><path d="M68.0759 37.3545H69.6419V37.836H68.0759V37.3545ZM68.1209 38.7045H69.8984V39.195H67.5359V36.045H69.8354V36.5355H68.1209V38.7045Z" fill="black"></path><path d="M59.1677 39.195V36.045H59.6492L61.6247 38.4705H61.3862V36.045H61.9667V39.195H61.4852L59.5097 36.7695H59.7482V39.195H59.1677Z" fill="black"></path><path d="M51.749 39.195V36.045H52.334V38.7H53.981V39.195H51.749Z" fill="black"></path><path d="M44.3301 39.195V36.045H44.9151V38.7H46.5621V39.195H44.3301Z" fill="black"></path><path d="M37.1306 37.3545H38.6966V37.836H37.1306V37.3545ZM37.1756 38.7045H38.9531V39.195H36.5906V36.045H38.8901V36.5355H37.1756V38.7045Z" fill="black"></path><path d="M27.5279 39.195L26.4839 36.045H27.0914L28.0229 38.8935H27.7214L28.6889 36.045H29.2289L30.1694 38.8935H29.8769L30.8309 36.045H31.3889L30.3449 39.195H29.7239L28.8644 36.6255H29.0264L28.1534 39.195H27.5279Z" fill="black"></path><path d="M98.4892 27.7306C99.6209 27.7306 100.852 25.7641 99.347 25.7641C98.2183 25.7646 96.985 27.7306 98.4892 27.7306Z" fill="black"></path><path d="M53.1529 14.6226C52.8538 14.0016 51.1516 15.3543 50.6322 15.8075C48.3113 17.8579 46.1808 20.0285 43.9151 22.1188C44.6372 20.5087 45.3229 18.85 45.82 17.1297C45.508 16.724 45.2107 16.1617 44.6972 16.0761C44.4615 16.0333 44.2776 16.313 44.1989 16.585C43.334 19.6509 41.9367 22.4343 40.6018 25.3143C40.2287 26.1328 41.4978 26.5362 42.0155 26.0566C45.5409 22.7239 49.1897 19.5331 52.5036 15.9893C52.7533 15.7319 53.2351 14.8031 53.1529 14.6226Z" fill="black"></path><path d="M61.0484 19.125C59.2052 20.8459 56.8637 22.0256 54.5364 22.9362C53.0469 23.5137 48.6319 24.6383 50.3846 21.5917C51.4563 19.7477 53.5598 18.1394 55.5258 17.3848C56.1175 17.1555 56.5359 17.5712 56.1892 18.1224C55.9072 18.5715 55.3878 18.9855 54.9653 19.2851C53.7161 20.1933 51.9305 20.6501 50.4581 20.0784C49.542 19.7231 48.3575 21.1004 49.505 21.5395C52.353 22.643 58.0142 20.86 58.4478 17.3203C58.6429 15.7325 56.9672 15.4739 55.7409 15.7466C53.8096 16.1822 52.1409 17.4246 50.6943 18.7198C48.6125 20.5891 46.1529 24.925 50.6749 25.2598C52.6949 25.4064 54.7832 24.5292 56.5847 23.7353C58.6758 22.8048 60.7188 21.6245 62.3992 20.0555C63.3294 19.1918 61.8117 18.4097 61.0484 19.125Z" fill="black"></path><path d="M92.858 23.5577C93.5413 24.2894 94.9591 26.0472 93.6336 26.905C93.0483 27.2996 92.2058 27.3125 91.5289 27.3454C91.2715 27.3548 88.2502 27.2504 89.4266 25.9329C89.9007 25.3946 90.6887 25.0411 91.3168 24.7086C92.8233 23.9077 94.4426 23.3055 96.0561 22.7784C99.1843 21.7623 102.38 20.9473 105.615 20.3475C107.302 20.0397 109.009 19.8133 110.72 19.665C111.858 19.5653 113.892 19.2176 114.898 19.9447C115.64 20.48 116.966 19.3431 116.17 18.765C114.861 17.8245 112.927 18.0256 111.421 18.1013C108.527 18.2467 105.648 18.8025 102.816 19.417C99.1638 20.2003 95.4409 21.2352 92.0271 22.7732C90.3056 23.553 88.1562 24.4325 87.4335 26.3252C86.7678 28.039 89.1175 28.6869 90.3026 28.8294C91.9666 29.0252 93.8657 28.7262 95.1389 27.5735C96.7677 26.0736 95.2605 23.6057 94.1183 22.3838C93.4867 21.7095 92.1687 22.83 92.858 23.5577Z" fill="black"></path><path d="M101.308 17.4158C102.243 16.3481 101.796 15.5279 100.635 14.9656C99.3454 14.3482 97.853 14.7129 96.5973 15.2089C94.9745 15.8632 93.3005 17.1837 92.1812 18.5058C90.7951 20.13 91.5348 21.4006 92.7382 22.711C93.0231 23.0224 94.6542 23.4961 94.0526 22.8412C93.2159 21.9288 92.794 21.3191 93.2664 20.0661C93.6665 18.9919 94.7271 18.235 95.6179 17.5982C96.3905 17.0424 97.1831 16.5129 98.0416 16.1007C98.8436 15.7184 100.934 15.2886 99.7273 16.6618C99.4982 16.9216 100.944 17.8233 101.308 17.4158Z" fill="black"></path><path d="M44.6578 18.8946C44.5626 18.643 44.2653 18.4572 43.9521 18.4572C43.7553 18.4572 43.7224 18.3921 43.5878 18.5093C43.0367 18.9984 41.2504 19.8139 40.3867 19.8139C40.1429 19.8139 39.9719 19.7553 39.899 19.6545C39.8362 19.5818 39.8203 19.4662 39.8485 19.3197C39.9566 19.1221 40.1875 18.643 40.1875 18.643C40.308 18.3733 40.2539 18.2045 40.1911 18.0954C40.0706 17.906 39.8062 17.7981 39.4689 17.7981C39.1252 17.7981 38.701 17.9242 38.4748 18.2045L38.4319 18.2566C38.1387 18.7081 37.9424 19.1144 37.8631 19.4639C37.4107 20.3739 36.8472 21.4223 36.0522 22.3041C35.5011 22.9156 34.816 23.4152 34.2161 23.8204C33.4881 24.3199 32.8846 24.3932 32.6114 24.0162C32.3893 23.7142 32.3799 23.156 32.5873 22.4859C32.9933 21.193 34.0891 19.7764 35.8495 18.2725C36.524 17.6879 37.8202 17.0764 38.8902 17.0764C39.5347 17.0764 40.3074 17.3056 40.3291 18.4144C40.3321 18.7269 40.6206 18.9374 41.0401 18.9374C41.338 18.9374 41.6418 18.8219 41.8286 18.643C41.9614 18.5017 42.0325 18.3229 42.0325 18.1271C42.0008 16.4906 40.345 15.7565 38.718 15.7565C38.2415 15.7565 37.7726 15.8116 37.3737 15.933C35.1462 16.6055 32.1131 18.9567 30.8728 21.9898C30.2535 23.5037 30.4926 24.3733 30.8123 24.84C31.1701 25.3782 31.8188 25.6784 32.6531 25.6784C33.1343 25.6784 33.6743 25.5682 34.2031 25.3612C36.0029 24.684 37.5464 23.2575 38.919 21.0153C39.1593 21.0681 39.4366 21.098 39.7516 21.098C41.3074 21.098 43.5302 20.3868 44.4122 19.607C44.7483 19.305 44.7118 19.0335 44.6578 18.8946Z" fill="black"></path><path d="M35.9575 9.52028C33.8816 9.18431 31.6036 9.98935 29.6817 10.6513C27.2215 11.4962 24.8977 12.8454 22.5627 13.9723C20.6778 14.877 16.3538 17.8298 15.1493 18.5058C17.4214 16.8184 23.3829 12.4144 25.6504 10.6771C26.9119 9.71025 28.1893 8.74339 29.3656 7.66982C30.0618 7.02192 30.6177 6.26027 30.6347 5.16442C30.6747 2.67133 28.0547 1.51626 26.0047 1.13749C20.2218 0.0691887 14.2121 1.55144 9.01389 4.09436C6.22763 5.46228 3.70108 7.19254 1.88548 9.75306C0.26614 12.0497 0.0616651 15.0764 2.6552 16.2602C4.27572 17.0013 6.12657 17.1725 7.86813 17.4334C8.66252 17.5566 8.32408 16.5756 7.61136 16.4671C6.03432 16.2209 5.25873 16.2238 4.00015 15.6692C3.66935 15.5255 2.76038 15.006 2.56119 14.459C2.39315 13.9852 2.32557 13.2365 2.48833 12.5147C2.66754 11.7102 3.09941 10.9281 3.32738 10.581C4.94085 8.13067 7.80291 6.5464 10.4006 5.31862C14.9407 3.18437 19.9668 2.068 24.9747 2.57928C26.1281 2.70593 27.265 2.95394 28.3103 3.43708C29.657 4.05918 29.5348 4.87125 28.647 5.75603C26.6622 7.73666 24.2666 9.37487 22.0239 11.0547C15.2451 16.1283 8.1766 20.9866 2.53357 27.3049C2.42546 27.4234 2.36847 27.6497 2.3526 27.8215C2.33556 28.0736 2.43192 28.4066 2.56824 28.6312C2.5747 28.6382 2.90609 29.102 3.12878 29.2322C3.36029 29.3665 3.79568 29.4075 4.12002 29.2633C4.43965 29.1214 4.64589 28.9701 4.70289 28.7743C4.73873 28.6623 4.73638 28.5028 4.83274 28.3779C4.93556 28.2483 5.28576 27.8408 5.28576 27.8408C9.80711 23.4381 15.0465 19.7483 20.5591 16.6864C24.5545 14.4654 28.9472 12.3388 33.4486 11.3485C34.2271 11.1732 37.0704 10.7862 36.1491 12.0656C34.9463 13.729 33.4451 14.7451 32.032 15.8603C29.724 17.6685 25.2009 20.7773 22.8359 22.7737C21.7789 23.6626 21.5256 24.246 21.421 24.6154C21.2959 25.0428 21.2436 25.526 21.3135 25.8737C21.4069 26.2929 21.6079 26.643 21.8276 26.8599C22.4922 27.5236 23.2889 27.7347 24.554 27.5758C25.9771 27.4023 27.815 26.3973 28.2028 26.1762C28.6011 25.9564 27.9337 25.8086 27.9337 25.8086C27.9337 25.8086 26.2697 26.2841 24.8677 26.3914C24.5017 26.3914 24.1791 26.3363 23.9364 26.1575C23.7484 26.0109 23.6091 25.8708 23.6197 25.4838C23.6262 25.2809 23.7225 25.0874 23.8871 24.8599C25.3025 22.8377 32.2335 17.699 32.2335 17.699H32.2282C32.9533 17.1731 33.6625 16.6296 34.3458 16.0725C35.4857 15.145 37.1162 14.072 37.6644 12.6331C38.215 11.2042 37.3742 9.74778 35.9575 9.52028Z" fill="black"></path><path d="M91.9484 19.6169C91.9307 19.6375 91.6399 19.9805 91.6399 19.9805C91.1863 20.4953 90.2785 21.4352 89.0816 22.1065C87.8712 22.7785 86.776 23.2422 86.3159 23.3777C83.8428 24.1346 85.4058 22.1317 85.4058 22.1317C85.632 21.8075 85.8135 21.5577 85.9034 21.441C87.0339 20.0115 88.47 18.3434 89.9089 17.2376C90.2139 17.0042 88.5551 16.3106 88.128 16.6407C86.0997 18.2045 83.7529 19.4504 81.6218 20.8787C80.724 21.4768 79.8186 22.0608 78.9413 22.6987C78.5618 22.969 78.1716 23.2129 77.7709 23.4545C78.0153 22.2302 79.2604 21.0259 80.0178 20.1423C80.8533 19.1813 81.7458 18.1581 82.7782 17.417C83.0831 17.2018 81.4397 16.4977 80.9955 16.8196C79.9549 17.5689 74.3782 22.7802 76.178 24.0725C77.6963 25.1513 79.4255 24.2038 80.7234 23.2921C81.7998 22.5369 82.9262 21.8274 84.0538 21.1168C83.8793 21.373 83.7341 21.6257 83.5961 21.8767C83.2794 22.3692 81.962 24.9508 84.8723 25.2745C87.7995 25.6063 92.3109 21.037 92.3109 21.037C92.3109 21.037 92.4149 20.6759 92.4725 20.5826C92.5865 20.4138 91.9484 19.6169 91.9484 19.6169Z" fill="black"></path><path d="M68.5542 20.2361C65.9118 22.2466 63.3477 24.3428 60.6343 26.2589C59.6154 26.9701 58.4421 27.9077 57.2117 28.2061C56.4966 28.3732 58.4415 29.326 58.418 28.6318C58.4115 28.3709 58.5143 28.09 58.5872 27.8414C58.8105 27.1167 59.1624 26.4225 59.4979 25.747C63.4047 17.7694 69.355 10.2749 76.4587 4.93575C76.4094 4.97797 75.1056 3.83755 74.7401 4.10785C70.12 7.57953 66.3102 11.8293 62.9088 16.4865C60.5732 19.6715 57.8351 23.4046 56.7998 27.2475C56.4643 28.4805 56.9819 28.9361 57.9191 29.1806C58.8498 29.4275 60.0009 28.5978 60.8329 28.09C64.1732 26.0402 66.9865 23.3742 70.0959 21.006C70.0436 21.0464 68.9167 19.9605 68.5542 20.2361Z" fill="black"></path><path d="M83.5042 2.67073C78.578 6.76685 74.2952 11.7542 70.6446 17.0101C69.2368 19.0364 67.9718 21.1631 66.7861 23.3225C66.0616 24.6348 64.756 26.5181 64.8289 28.0988C64.8582 28.7754 65.5439 29.2861 66.8037 29.3459C68.3278 29.4286 70.5547 27.2275 71.6552 26.3967C74.4039 24.3258 77.0879 22.1393 79.7954 20.0162C79.7543 20.0496 79.2049 18.5093 78.86 18.7855C76.7242 20.4554 73.8163 22.5234 71.6958 24.202C70.1399 25.4333 68.564 26.6758 66.8636 27.7054C66.598 27.8672 66.3254 28.0109 66.0457 28.1451C65.853 28.2348 65.652 28.3046 65.444 28.3539C64.8159 28.4055 65.1937 28.5937 66.5522 28.9191C66.4341 28.4055 66.8096 27.6884 66.994 27.2269C68.4277 23.6139 70.6987 20.1358 72.9673 16.989C76.5156 12.062 80.5511 7.39071 85.2205 3.49981C85.1905 3.51447 83.8321 2.39281 83.5042 2.67073Z" fill="black"></path></g><defs><clipPath id="clip0_4321_3704"><rect width="117" height="39.5166" fill="white"></rect></clipPath></defs></svg>
          </div>

          {/* Step Progress Container - Mobile: Circles, Desktop: Full */}
          <div className="step-progress-container w-full max-w-[820px] mx-auto mb-4 md:max-w-[820px] md:w-full md:mx-auto">
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
            <div className="hidden md:flex introProfile-image bg-[#f5f5f5] items-center justify-center h-[100px] w-[100px] overflow-hidden flex-shrink-0" style={{ borderRadius: '8px' }}>
              <img 
                src={bdProfilePath}
                alt="Beatriz Durango"
                className="w-[100px] h-[100px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with padding for fixed header */}
      <div className="main-content-area flex-1 flex flex-col items-center gap-4 pb-32" style={{ paddingTop: '320px' }}>
        {/* Form Container */}
        <div className="flex flex-col gap-4 w-full max-w-[820px] px-4 md:px-0">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
