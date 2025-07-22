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

  // Check if all prerequisites are met - only check what's in the schema
  const isFormValid = selectedDate && selectedTimes.length > 0;

  const onSubmit = (values: TimePreferences) => {
    console.log("Step 1 - Form submitted with values:", values);
    console.log("Step 1 - isFormValid:", isFormValid);
    console.log("Step 1 - selectedDate:", selectedDate);
    console.log("Step 1 - selectedTimes:", selectedTimes);
    console.log("Step 1 - form errors:", form.formState.errors);
    
    if (values.timePreferences.length === 0) {
      console.log("Step 1 - Setting error: no time preferences");
      form.setError("timePreferences", { message: "Please select at least one time preference" });
      return;
    }
    
    console.log("Step 1 - Calling onUpdate and onNext");
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
        <div 
          className="next-button-container" 
          style={{ 
            flex: 1,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            border: isFormValid ? '1px solid #111111' : '1px solid #CCC',
            background: isFormValid ? '#111111' : '#fff',
            color: isFormValid ? '#FFF' : '#111',
            opacity: isFormValid ? 1 : 0.6,
            marginTop: '24px'
          }}
          onClick={isFormValid ? form.handleSubmit(onSubmit) : undefined}
        >
          <div style={{ flexShrink: 0 }}>
            <div className="step-text" style={{ color: 'inherit' }}>Step 1 of 4</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <div className="action-text" style={{ color: 'inherit' }}>
              Next step
            </div>
          </div>
        </div>

        <FormMessage />
      </form>
    </Form>
  );
}