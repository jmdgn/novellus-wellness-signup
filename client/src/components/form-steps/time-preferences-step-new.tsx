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

const morningTimes = ["7.00 am", "8.00 am", "9.00 am", "10.00 am"];
const afternoonTimes = ["1.00 pm", "2.00 pm", "3.00 pm"];
const eveningTimes = ["5.00 pm", "6.00 pm", "7.00 pm"];

export default function TimePreferencesStep({ data, onUpdate, onNext }: TimePreferencesStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data?.selectedDate ? new Date(data.selectedDate) : undefined);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(data?.timePreferences || []);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "spanish">(data?.language || "english");
  const [selectedClassType, setSelectedClassType] = useState<"mat" | "reformer" | "both">(data?.classType || "mat");

  const form = useForm<TimePreferences>({
    resolver: zodResolver(timePreferencesSchema),
    defaultValues: {
      selectedDate: data?.selectedDate,
      timePreferences: data?.timePreferences || [],
      classType: data?.classType || "mat",
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

  const handleClassTypeSelect = (classType: "mat" | "reformer" | "both") => {
    setSelectedClassType(classType);
    form.setValue("classType", classType);
  };

  const onSubmit = (values: TimePreferences) => {
    if (values.timePreferences.length === 0) {
      form.setError("timePreferences", { message: "Please select at least one time preference" });
      return;
    }
    onUpdate(values);
    onNext();
  };

  const renderTimeSection = (title: string, times: string[], icon: string) => (
    <div className="bg-white border border-[#ebebeb] rounded-xl p-8 shadow-[4px_4px_24px_rgba(170,170,170,0.1)]">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-start gap-3">
          <div className="bg-[#e0f2fe] rounded-lg p-2.5 h-10 w-8 flex items-center justify-center">
            <span className="text-[20px] font-semibold leading-normal tracking-[0.4px] text-black">
              {icon}
            </span>
          </div>
          <span className="text-[16px] font-normal leading-6 text-[#777]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-4 pt-1">
          <button className="text-[#333] hover:text-black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="text-[#333] hover:text-black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {times.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => handleTimeSelection(time)}
            className={`p-3 rounded-lg border text-left text-sm font-medium transition-colors ${
              selectedTimes.includes(time)
                ? "bg-blue-50 border-blue-200 text-blue-900"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Date & Time Selection */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <h2 className="text-[22px] font-normal leading-6 tracking-[-0.22px] text-black">
              1. Select Class Date & Time
            </h2>
            <p className="text-[16px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Select a Friday and up to 3 time preferences in order of priority.
            </p>
          </div>

          <div className="flex gap-6 w-full">
            {/* Calendar */}
            <div className="bg-white border border-[#ebebeb] rounded-xl p-12 shadow-[4px_4px_24px_rgba(170,170,170,0.1)]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => !isFriday(date) || date < new Date()}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            <div className="flex flex-col gap-6 w-[386px]">
              {renderTimeSection("Morning", morningTimes, "🌅")}
              {renderTimeSection("Afternoon", afternoonTimes, "☀️")}
              {renderTimeSection("Evening", eveningTimes, "🌆")}
            </div>
          </div>
        </div>

        {/* Step 2: Class Type */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <h2 className="text-[22px] font-normal leading-6 tracking-[-0.22px] text-black">
              2. What kind of classes are you interested in?
            </h2>
            <p className="text-[16px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Please select your preferred class type.
            </p>
          </div>

          <div className="flex gap-6">
            {[
              { value: "mat", label: "Mat Pilates", icon: "🧘" },
              { value: "reformer", label: "Reformer", icon: "⚙️" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleClassTypeSelect(option.value as "mat" | "reformer")}
                className={`bg-white border border-[#ddd] rounded-xl p-4 pr-8 pl-4 flex items-center gap-4 transition-colors ${
                  selectedClassType === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-300"
                }`}
              >
                <div className="bg-[#e0f2fe] rounded-lg p-2.5 h-10 flex items-center justify-center">
                  <span className="text-[20px] font-semibold leading-normal tracking-[0.4px] text-black">
                    {option.icon}
                  </span>
                </div>
                <span className="text-[16px] font-medium text-black">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Language */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <h2 className="text-[22px] font-normal leading-6 tracking-[-0.22px] text-black">
              3. What language would you prefer?
            </h2>
            <p className="text-[16px] font-normal leading-[22px] tracking-[0.16px] text-[#999]">
              Choose your preferred language for the classes.
            </p>
          </div>

          <div className="flex gap-6">
            {[
              { value: "english", label: "English", icon: "🇺🇸" },
              { value: "spanish", label: "Spanish", icon: "🇪🇸" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLanguageSelect(option.value as "english" | "spanish")}
                className={`bg-white border border-[#ddd] rounded-xl p-4 pr-8 pl-4 flex items-center gap-4 transition-colors ${
                  selectedLanguage === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-300"
                }`}
              >
                <div className="bg-[#e0f2fe] rounded-lg p-2.5 h-10 flex items-center justify-center">
                  <span className="text-[20px] font-semibold leading-normal tracking-[0.4px] text-black">
                    {option.icon}
                  </span>
                </div>
                <span className="text-[16px] font-medium text-black">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-white border border-[#111] text-black rounded-md py-4 px-6 flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-[16px] font-medium">Step 1/4</span>
            <span className="text-[16px] font-medium">Next</span>
          </Button>
        </div>

        <FormMessage />
      </form>
    </Form>
  );
}