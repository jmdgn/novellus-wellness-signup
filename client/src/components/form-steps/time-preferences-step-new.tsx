import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timePreferencesSchema, type TimePreferences } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, isFriday } from "date-fns";

interface TimePreferencesStepProps {
  data?: Partial<TimePreferences>;
  onUpdate: (data: TimePreferences) => void;
  onNext: () => void;
}

const allTimes = ["7.00 am", "8.30 am", "10.00 am", "11.30 am", "2.30 pm", "4.00 pm"];

export default function TimePreferencesStep({ data, onUpdate, onNext }: TimePreferencesStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data?.selectedDate ? new Date(data.selectedDate) : undefined);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(data?.timePreferences || []);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "spanish">(data?.language || "english");
  const [selectedClassType, setSelectedClassType] = useState<"semi-private" | "private">(data?.classType || "semi-private");
  const [selectedClassPreference, setSelectedClassPreference] = useState<"mat" | "reformer" | "both">("mat");

  const form = useForm<TimePreferences>({
    resolver: zodResolver(timePreferencesSchema),
    defaultValues: {
      selectedDate: data?.selectedDate,
      timePreferences: data?.timePreferences || [],
      classType: data?.classType || "semi-private",
      language: data?.language || "english",
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue("selectedDate", date?.toISOString());
  };

  const handleTimeSelection = (time: string) => {
    const currentIndex = selectedTimes.indexOf(time);
    let newSelectedTimes: string[];

    if (currentIndex > -1) {
      newSelectedTimes = selectedTimes.filter(t => t !== time);
    } else if (selectedTimes.length < 3) {
      newSelectedTimes = [...selectedTimes, time];
    } else {
      return;
    }

    setSelectedTimes(newSelectedTimes);
    form.setValue("timePreferences", newSelectedTimes);
  };

  const handleLanguageSelect = (language: "english" | "spanish") => {
    setSelectedLanguage(language);
    form.setValue("language", language);
  };

  const handleClassTypeSelect = (classType: "semi-private" | "private") => {
    setSelectedClassType(classType);
    form.setValue("classType", classType);
  };

  const handleClassPreferenceSelect = (preference: "mat" | "reformer" | "both") => {
    setSelectedClassPreference(preference);
  };

  // Check if all prerequisites are met
  const isFormValid = selectedDate && selectedTimes.length > 0 && selectedClassType && selectedClassPreference && selectedLanguage;

  const onSubmit = (values: TimePreferences) => {
    if (values.timePreferences.length === 0) {
      form.setError("timePreferences", { message: "Please select at least one time preference" });
      return;
    }
    onUpdate(values);
    onNext();
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* Step 1: Date & Time Selection */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.22px] text-black">
              1. Select Class Date & Time
            </h2>
            <p className="text-[14px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Select a Friday and up to 3 time preferences in order of priority.
            </p>
          </div>

          <div className="bg-white border border-[#ebebeb] rounded-xl p-8 shadow-[4px_4px_24px_rgba(170,170,170,0.1)] w-full">
            <div className="flex items-start w-full">
              {/* Calendar - Left Column */}
              <div className="flex-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => !isFriday(date) || date < new Date()}
                  className="w-full"
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-[#ebebeb] self-stretch mx-8"></div>

              {/* Time Selection - Right Column */}
              <div className="flex-1">
                <h3 className="text-[14px] font-normal text-black mb-4">Select up to 3 time preferences</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {allTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelection(time)}
                      className={`relative p-3 border text-center text-xs font-medium transition-colors ${
                        selectedTimes.includes(time)
                          ? "bg-blue-500 border-blue-500 text-white rounded-lg"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 rounded-lg"
                      }`}
                      style={{ borderRadius: '8px' }}
                    >
                      {selectedTimes.includes(time) && (
                        <div className="absolute top-1 right-1 bg-white text-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                          {selectedTimes.indexOf(time) + 1}
                        </div>
                      )}
                      {time}
                    </button>
                  ))}
                </div>
                {selectedTimes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Selected times (in order of preference):</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTimes.map((time, index) => (
                        <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {index + 1}. {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Class Type */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.22px] text-black">
              2. Choose class type
            </h2>
            <p className="text-[14px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Please select your preferred class type.
            </p>
          </div>

          <div className="flex gap-4">
            {[
              { value: "semi-private", label: "Semi-private", icon: "👥" },
              { value: "private", label: "Private", icon: "👤" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleClassTypeSelect(option.value as "semi-private" | "private")}
                className={`border p-4 pr-8 pl-4 flex items-center gap-4 transition-colors ${
                  selectedClassType === option.value
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "bg-white border-[#ddd] text-black hover:border-gray-300"
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div className={`p-2.5 h-10 flex items-center justify-center ${
                  selectedClassType === option.value
                    ? "bg-white"
                    : "bg-[#e0f2fe]"
                }`} style={{ borderRadius: '6px' }}>
                  <span className={`text-[20px] font-semibold leading-normal tracking-[0.4px] ${
                    selectedClassType === option.value ? "text-blue-500" : "text-black"
                  }`}>
                    {option.icon}
                  </span>
                </div>
                <span className="text-[16px] font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Class Preference */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.22px] text-black">
              3. Select class preference
            </h2>
            <p className="text-[14px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Choose your preferred class style.
            </p>
          </div>

          <div className="flex gap-4">
            {[
              { value: "mat", label: "Mat", icon: "🧘" },
              { value: "reformer", label: "Reformer", icon: "⚙️" },
              { value: "both", label: "Both", icon: "💪" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleClassPreferenceSelect(option.value as "mat" | "reformer" | "both")}
                className={`border p-4 pr-8 pl-4 flex items-center gap-4 transition-colors ${
                  selectedClassPreference === option.value
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "bg-white border-[#ddd] text-black hover:border-gray-300"
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div className={`p-2.5 h-10 flex items-center justify-center ${
                  selectedClassPreference === option.value
                    ? "bg-white"
                    : "bg-[#e0f2fe]"
                }`} style={{ borderRadius: '6px' }}>
                  <span className={`text-[20px] font-semibold leading-normal tracking-[0.4px] ${
                    selectedClassPreference === option.value ? "text-blue-500" : "text-black"
                  }`}>
                    {option.icon}
                  </span>
                </div>
                <span className="text-[16px] font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Language */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.22px] text-black">
              4. What language would you prefer?
            </h2>
            <p className="text-[14px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Choose your preferred language for the classes.
            </p>
          </div>

          <div className="flex gap-4">
            {[
              { value: "english", label: "English", icon: "🇺🇸" },
              { value: "spanish", label: "Spanish", icon: "🇪🇸" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLanguageSelect(option.value as "english" | "spanish")}
                className={`border p-4 pr-8 pl-4 flex items-center gap-4 transition-colors ${
                  selectedLanguage === option.value
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "bg-white border-[#ddd] text-black hover:border-gray-300"
                }`}
                style={{ borderRadius: '12px' }}
              >
                <div className={`p-2.5 h-10 flex items-center justify-center ${
                  selectedLanguage === option.value
                    ? "bg-white"
                    : "bg-[#e0f2fe]"
                }`} style={{ borderRadius: '6px' }}>
                  <span className={`text-[20px] font-semibold leading-normal tracking-[0.4px] ${
                    selectedLanguage === option.value ? "text-blue-500" : "text-black"
                  }`}>
                    {option.icon}
                  </span>
                </div>
                <span className="text-[16px] font-medium">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-6">
          <button
            type="submit"
            className={`w-full border rounded-md flex justify-between items-center transition-colors ${
              isFormValid 
                ? "bg-black border-black text-white hover:bg-gray-800" 
                : "bg-white border-[#111] text-black hover:bg-gray-50"
            }`}
            style={{ padding: '16px 24px' }}
          >
            <div className="w-16 h-5 flex items-center">
              <svg width="64" height="20" viewBox="0 0 64 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.652 11.494C1.708 12.586 2.254 13.118 3.304 13.118C3.836 13.118 4.256 12.978 4.592 12.684C4.928 12.404 5.096 12.012 5.096 11.536C5.096 11.34 5.054 11.158 4.998 11.004C4.942 10.85 4.83 10.71 4.69 10.584C4.55 10.458 4.354 10.332 4.116 10.22C3.864 10.108 3.57 9.982 3.206 9.856C2.926 9.772 2.688 9.688 2.492 9.604C2.296 9.534 2.142 9.464 2.002 9.394C1.862 9.324 1.736 9.254 1.624 9.17C1.512 9.1 1.414 9.016 1.316 8.918C0.826 8.484 0.588 7.896 0.588 7.154C0.588 6.762 0.644 6.412 0.784 6.076C0.924 5.754 1.106 5.474 1.358 5.236C1.596 5.012 1.89 4.83 2.24 4.69C2.576 4.564 2.954 4.494 3.374 4.494C3.78 4.494 4.158 4.564 4.494 4.69C4.83 4.816 5.11 4.998 5.362 5.222C5.6 5.46 5.782 5.74 5.922 6.076C6.062 6.412 6.132 6.776 6.146 7.168H4.97C4.956 6.93 4.928 6.748 4.9 6.608C4.872 6.468 4.816 6.342 4.746 6.202C4.606 6.006 4.424 5.838 4.172 5.726C3.92 5.614 3.654 5.544 3.36 5.544C2.884 5.544 2.506 5.698 2.212 5.978C1.918 6.258 1.778 6.622 1.778 7.07C1.778 7.546 1.946 7.896 2.31 8.148C2.38 8.204 2.45 8.26 2.534 8.302C2.604 8.344 2.702 8.386 2.814 8.428C2.926 8.484 3.052 8.54 3.206 8.596C3.36 8.652 3.556 8.722 3.808 8.806C4.298 8.988 4.676 9.156 4.956 9.296C5.236 9.436 5.46 9.618 5.656 9.814C6.076 10.262 6.286 10.822 6.286 11.466C6.286 11.872 6.216 12.236 6.076 12.572C5.936 12.908 5.726 13.188 5.474 13.426C5.208 13.664 4.9 13.846 4.536 13.972C4.172 14.112 3.78 14.168 3.346 14.168C2.17 14.168 1.33 13.748 0.854 12.908C0.63 12.544 0.532 12.138 0.532 11.69V11.494H1.652ZM9.1023 12.684C9.1023 12.852 9.1303 12.95 9.2003 13.006C9.2703 13.062 9.3963 13.076 9.5923 13.076H10.0823V14H9.0883C8.7103 14 8.4443 13.93 8.2763 13.762C8.1083 13.608 8.0383 13.356 8.0383 12.992V8.484H7.1423V7.546H8.0383V5.516H9.1023V7.546H10.0823V8.484H9.1023V12.684ZM12.0843 11.116C12.1123 11.396 12.1543 11.606 12.2103 11.774C12.2663 11.942 12.3643 12.124 12.5043 12.292C12.7143 12.586 12.9663 12.81 13.2603 12.95C13.5543 13.104 13.8763 13.174 14.2403 13.174C14.6323 13.174 15.0103 13.076 15.3603 12.88C15.7103 12.684 15.9763 12.404 16.1723 12.068L17.1103 12.418C16.8303 12.964 16.4383 13.384 15.9343 13.692C15.4163 14 14.8563 14.154 14.2403 14.154C13.7643 14.154 13.3163 14.07 12.9103 13.902C12.5043 13.734 12.1543 13.51 11.8743 13.216C11.5803 12.922 11.3563 12.572 11.1883 12.152C11.0203 11.746 10.9503 11.298 10.9503 10.794C10.9503 10.304 11.0203 9.856 11.1883 9.436C11.3563 9.016 11.5803 8.666 11.8603 8.358C12.1403 8.05 12.4903 7.812 12.8823 7.644C13.2743 7.476 13.7223 7.392 14.1983 7.392C14.6603 7.392 15.0943 7.476 15.5003 7.644C15.8923 7.812 16.2423 8.05 16.5363 8.344C16.8303 8.638 17.0543 8.988 17.2223 9.38C17.3903 9.786 17.4743 10.22 17.4743 10.696V10.892C17.4743 10.976 17.4603 11.046 17.4603 11.116H12.0843ZM16.3403 10.332C16.3123 10.08 16.2843 9.884 16.2283 9.716C16.1723 9.548 16.0883 9.394 15.9763 9.226C15.7663 8.96 15.5003 8.75 15.1923 8.582C14.8843 8.428 14.5483 8.344 14.1983 8.344C13.8343 8.344 13.5123 8.428 13.2043 8.582C12.8963 8.75 12.6443 8.96 12.4623 9.24C12.3503 9.408 12.2803 9.562 12.2383 9.716C12.1823 9.87 12.1403 10.08 12.0983 10.332H16.3403ZM20.0792 7.546V8.722C20.3872 8.246 20.7092 7.91 21.0732 7.7C21.4372 7.504 21.8852 7.392 22.4312 7.392C22.8792 7.392 23.2852 7.476 23.6632 7.644C24.0272 7.812 24.3492 8.036 24.6152 8.33C24.8812 8.624 25.0912 8.974 25.2452 9.38C25.3852 9.8 25.4692 10.248 25.4692 10.724C25.4692 11.228 25.3852 11.704 25.2452 12.124C25.0912 12.544 24.8812 12.908 24.6152 13.202C24.3492 13.51 24.0272 13.734 23.6632 13.902C23.2852 14.07 22.8792 14.154 22.4312 14.154C21.9272 14.154 21.4652 14.042 21.0172 13.818C20.8212 13.72 20.6532 13.622 20.5272 13.51C20.4012 13.398 20.2472 13.23 20.0792 12.992V17.024H19.0152V7.546H20.0792ZM22.2492 8.344C21.9132 8.344 21.6192 8.414 21.3532 8.526C21.0872 8.652 20.8632 8.82 20.6812 9.044C20.4852 9.268 20.3452 9.548 20.2332 9.856C20.1212 10.164 20.0792 10.514 20.0792 10.878C20.0792 11.242 20.1212 11.564 20.2332 11.844C20.3312 12.138 20.4712 12.39 20.6672 12.586C20.8492 12.796 21.0732 12.95 21.3392 13.062C21.5912 13.174 21.8852 13.23 22.2072 13.23C22.5152 13.23 22.8092 13.174 23.0752 13.062C23.3272 12.95 23.5512 12.782 23.7472 12.558C23.9292 12.334 24.0692 12.082 24.1812 11.774C24.2792 11.466 24.3352 11.13 24.3352 10.766C24.3352 10.01 24.1392 9.436 23.7752 9.016C23.5792 8.806 23.3552 8.638 23.0892 8.526C22.8092 8.414 22.5292 8.344 22.2492 8.344ZM31.7688 7.728V6.664L34.9328 4.592V14H33.8268V6.356L31.7688 7.728ZM45.2621 7.392C45.7381 7.392 46.1721 7.476 46.5781 7.644C46.9701 7.812 47.3201 8.05 47.6001 8.358C47.8801 8.666 48.1041 9.016 48.2721 9.436C48.4401 9.856 48.5241 10.304 48.5241 10.794C48.5241 11.27 48.4261 11.718 48.2581 12.124C48.0901 12.53 47.8521 12.88 47.5581 13.188C47.2641 13.496 46.9141 13.734 46.5081 13.902C46.1021 14.07 45.6681 14.154 45.2201 14.154C44.7441 14.154 44.2961 14.07 43.9041 13.902C43.4981 13.734 43.1481 13.51 42.8681 13.202C42.5741 12.908 42.3501 12.558 42.1961 12.138C42.0281 11.718 41.9581 11.27 41.9581 10.766C41.9581 10.262 42.0281 9.814 42.1961 9.394C42.3501 8.988 42.5741 8.638 42.8681 8.33C43.1621 8.036 43.5121 7.812 43.9181 7.644C44.3101 7.476 44.7581 7.392 45.2621 7.392ZM45.2621 8.372C44.5901 8.372 44.0441 8.596 43.6521 9.03C43.2461 9.478 43.0501 10.052 43.0501 10.78C43.0501 11.508 43.2461 12.082 43.6521 12.516C44.0441 12.964 44.5761 13.174 45.2481 13.174C45.5561 13.174 45.8501 13.118 46.1161 13.006C46.3821 12.894 46.6201 12.726 46.8161 12.502C47.0121 12.292 47.1521 12.04 47.2641 11.746C47.3761 11.466 47.4321 11.144 47.4321 10.78C47.4321 10.416 47.3761 10.094 47.2781 9.8C47.1661 9.506 47.0261 9.254 46.8301 9.044C46.6341 8.834 46.4101 8.666 46.1441 8.554C45.8781 8.442 45.5841 8.372 45.2621 8.372ZM51.322 14H50.258V8.484H49.376V7.546H50.258V6.678C50.258 6.034 50.412 5.544 50.72 5.18C51.028 4.83 51.476 4.648 52.036 4.648H52.162C52.218 4.648 52.274 4.662 52.33 4.662V5.614C51.924 5.67 51.658 5.768 51.518 5.908C51.378 6.048 51.322 6.314 51.322 6.678V7.546H52.33V8.484H51.322V14ZM57.4483 11.9V11.032L62.2643 4.536V10.892H63.3563V11.9H62.2643V14H61.1863V11.9H57.4483ZM61.1863 7.322L58.5683 10.892H61.1863V7.322Z" fill={isFormValid ? "#FFFFFF" : "#111111"} />
              </svg>
            </div>
            <div className="w-14 h-5 flex items-center justify-end">
              <svg width="56" height="20" viewBox="0 0 56 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.338 14H1.162V4.662H2.24L7.224 11.69V4.662H8.4V14H7.364L2.338 6.86V14ZM11.2503 11.116C11.2783 11.396 11.3203 11.606 11.3763 11.774C11.4323 11.942 11.5303 12.124 11.6703 12.292C11.8803 12.586 12.1323 12.81 12.4263 12.95C12.7203 13.104 13.0423 13.174 13.4063 13.174C13.7983 13.174 14.1763 13.076 14.5263 12.88C14.8763 12.684 15.1423 12.404 15.3383 12.068L16.2763 12.418C15.9963 12.964 15.6043 13.384 15.1003 13.692C14.5823 14 14.0223 14.154 13.4063 14.154C12.9303 14.154 12.4823 14.07 12.0763 13.902C11.6703 13.734 11.3203 13.51 11.0403 13.216C10.7463 12.922 10.5223 12.572 10.3543 12.152C10.1863 11.746 10.1163 11.298 10.1163 10.794C10.1163 10.304 10.1863 9.856 10.3543 9.436C10.5223 9.016 10.7463 8.666 11.0263 8.358C11.3063 8.05 11.6563 7.812 12.0483 7.644C12.4403 7.476 12.8883 7.392 13.3643 7.392C13.8263 7.392 14.2603 7.476 14.6663 7.644C15.0583 7.812 15.4083 8.05 15.7023 8.344C15.9963 8.638 16.2203 8.988 16.3883 9.38C16.5563 9.786 16.6403 10.22 16.6403 10.696V10.892C16.6403 10.976 16.6263 11.046 16.6263 11.116H11.2503ZM15.5063 10.332C15.4783 10.08 15.4503 9.884 15.3943 9.716C15.3383 9.548 15.2543 9.394 15.1423 9.226C14.9323 8.96 14.6663 8.75 14.3583 8.582C14.0503 8.428 13.7143 8.344 13.3643 8.344C13.0003 8.344 12.6783 8.428 12.3703 8.582C12.0623 8.75 11.8103 8.96 11.6283 9.24C11.5163 9.408 11.4463 9.562 11.4043 9.716C11.3483 9.87 11.3063 10.08 11.2643 10.332H15.5063ZM18.3121 14H17.0101L19.3901 10.794L16.9681 7.546H18.3121L20.0341 9.912L21.7981 7.546H23.1001L20.6641 10.794L22.9881 14H21.6861L20.0341 11.662L18.3121 14ZM25.3582 12.684C25.3582 12.852 25.3862 12.95 25.4562 13.006C25.5262 13.062 25.6522 13.076 25.8482 13.076H26.3382V14H25.3442C24.9662 14 24.7002 13.93 24.5322 13.762C24.3642 13.608 24.2942 13.356 24.2942 12.992V8.484H23.3982V7.546H24.2942V5.516H25.3582V7.546H26.3382V8.484H25.3582V12.684ZM35.0265 9.31V9.24C35.0265 8.946 34.9145 8.708 34.6905 8.526C34.4665 8.358 34.1585 8.26 33.7945 8.26C33.4305 8.26 33.1505 8.344 32.9405 8.512C32.7305 8.68 32.6325 8.904 32.6325 9.184C32.6325 9.324 32.6465 9.45 32.6885 9.548C32.7305 9.66 32.8005 9.744 32.9125 9.828C33.0245 9.912 33.1645 9.982 33.3605 10.052C33.5425 10.122 33.7805 10.192 34.0745 10.276C34.4945 10.388 34.8165 10.5 35.0545 10.612C35.2785 10.724 35.4745 10.864 35.6425 11.018C35.7965 11.186 35.9225 11.368 36.0205 11.592C36.1045 11.816 36.1605 12.04 36.1605 12.278C36.1605 12.558 36.1045 12.824 35.9925 13.048C35.8805 13.272 35.7125 13.468 35.5165 13.636C35.3205 13.804 35.0825 13.944 34.8025 14.028C34.5225 14.112 34.2005 14.154 33.8645 14.154C32.3665 14.154 31.5685 13.496 31.4565 12.166H32.5065C32.5765 12.922 33.0245 13.286 33.8645 13.286C34.2285 13.286 34.5085 13.202 34.7325 13.034C34.9565 12.866 35.0685 12.628 35.0685 12.334C35.0685 12.054 34.9565 11.844 34.7465 11.676C34.5225 11.508 34.1445 11.354 33.5985 11.214C32.8985 11.032 32.3805 10.78 32.0585 10.472C31.7225 10.164 31.5685 9.772 31.5685 9.268C31.5685 8.708 31.7645 8.26 32.1845 7.91C32.6045 7.574 33.1505 7.392 33.8365 7.392C34.5225 7.392 35.0685 7.56 35.4605 7.896C35.8525 8.232 36.0625 8.694 36.0905 9.31H35.0265ZM38.9617 12.684C38.9617 12.852 38.9897 12.95 39.0597 13.006C39.1297 13.062 39.2557 13.076 39.4517 13.076H39.9417V14H38.9477C38.5697 14 38.3037 13.93 38.1357 13.762C37.9677 13.608 37.8977 13.356 37.8977 12.992V8.484H37.0017V7.546H37.8977V5.516H38.9617V7.546H39.9417V8.484H38.9617V12.684ZM41.9437 11.116C41.9717 11.396 42.0137 11.606 42.0697 11.774C42.1257 11.942 42.2237 12.124 42.3637 12.292C42.5737 12.586 42.8257 12.81 43.1197 12.95C43.4137 13.104 43.7357 13.174 44.0997 13.174C44.4917 13.174 44.8697 13.076 45.2197 12.88C45.5697 12.684 45.8357 12.404 46.0317 12.068L46.9697 12.418C46.6897 12.964 46.2977 13.384 45.7937 13.692C45.2757 14 44.7157 14.154 44.0997 14.154C43.6237 14.154 43.1757 14.07 42.7697 13.902C42.3637 13.734 42.0137 13.51 41.7337 13.216C41.4397 12.922 41.2157 12.572 41.0477 12.152C40.8797 11.746 40.8097 11.298 40.8097 10.794C40.8097 10.304 40.8797 9.856 41.0477 9.436C41.2157 9.016 41.4397 8.666 41.7197 8.358C41.9997 8.05 42.3497 7.812 42.7417 7.644C43.1337 7.476 43.5817 7.392 44.0577 7.392C44.5197 7.392 44.9537 7.476 45.3597 7.644C45.7517 7.812 46.1017 8.05 46.3957 8.344C46.6897 8.638 46.9137 8.988 47.0817 9.38C47.2497 9.786 47.3337 10.22 47.3337 10.696V10.892C47.3337 10.976 47.3197 11.046 47.3197 11.116H41.9437ZM46.1997 10.332C46.1717 10.08 46.1437 9.884 46.0877 9.716C46.0317 9.548 45.9477 9.394 45.8357 9.226C45.6257 8.96 45.3597 8.75 45.0517 8.582C44.7437 8.428 44.4077 8.344 44.0577 8.344C43.6937 8.344 43.3717 8.428 43.0637 8.582C42.7557 8.75 42.5037 8.96 42.3217 9.24C42.2097 9.408 42.1397 9.562 42.0977 9.716C42.0417 9.87 41.9997 10.08 41.9577 10.332H46.1997ZM49.9385 7.546V8.722C50.2465 8.246 50.5685 7.91 50.9325 7.7C51.2965 7.504 51.7445 7.392 52.2905 7.392C52.7385 7.392 53.1445 7.476 53.5225 7.644C53.8865 7.812 54.2085 8.036 54.4745 8.33C54.7405 8.624 54.9505 8.974 55.1045 9.38C55.2445 9.8 55.3285 10.248 55.3285 10.724C55.3285 11.228 55.2445 11.704 55.1045 12.124C54.9505 12.544 54.7405 12.908 54.4745 13.202C54.2085 13.51 53.8865 13.734 53.5225 13.902C53.1445 14.07 52.7385 14.154 52.2905 14.154C51.7865 14.154 51.3245 14.042 50.8765 13.818C50.6805 13.72 50.5125 13.622 50.3865 13.51C50.2605 13.398 50.1065 13.23 49.9385 12.992V17.024H48.8745V7.546H49.9385ZM52.1085 8.344C51.7725 8.344 51.4785 8.414 51.2125 8.526C50.9465 8.652 50.7225 8.82 50.5405 9.044C50.3445 9.268 50.2045 9.548 50.0925 9.856C49.9805 10.164 49.9385 10.514 49.9385 10.878C49.9385 11.242 49.9805 11.564 50.0925 11.844C50.1905 12.138 50.3305 12.39 50.5265 12.586C50.7085 12.796 50.9325 12.95 51.1985 13.062C51.4505 13.174 51.7445 13.23 52.0665 13.23C52.3745 13.23 52.6685 13.174 52.9345 13.062C53.1865 12.95 53.4105 12.782 53.6065 12.558C53.7885 12.334 53.9285 12.082 54.0405 11.774C54.1385 11.466 54.1945 11.13 54.1945 10.766C54.1945 10.01 53.9985 9.436 53.6345 9.016C53.4385 8.806 53.2145 8.638 52.9485 8.526C52.6685 8.414 52.3885 8.344 52.1085 8.344Z" fill={isFormValid ? "#FFFFFF" : "#111111"} />
              </svg>
            </div>
          </button>
        </div>

        <FormMessage />
      </form>
    </Form>
  );
}