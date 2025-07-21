import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timePreferencesSchema, type TimePreferences } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { format, isFriday } from "date-fns";

interface TimePreferencesStepProps {
  data?: Partial<TimePreferences>;
  onUpdate: (data: TimePreferences) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const availableTimes = [
  "7.00 am", "8.00 am", "9.00 am", "10.00 am",
  "1.00 pm", "2.00 pm", "3.00 pm", 
  "5.00 pm", "6.00 pm", "7.00 pm"
];

export default function TimePreferencesStep({ data, onUpdate, onNext, onPrevious }: TimePreferencesStepProps) {
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
      // Remove if already selected
      newSelectedTimes = selectedTimes.filter(t => t !== time);
    } else if (selectedTimes.length < 3) {
      // Add if under limit
      newSelectedTimes = [...selectedTimes, time];
    } else {
      // Already at limit
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
    if (!selectedDate) {
      form.setError("selectedDate", { message: "Please select a date" });
      return;
    }
    onUpdate(values);
    onNext();
  };

  // Check if form is valid (at least one time selected and date selected)
  const isFormValid = selectedTimes.length > 0 && selectedDate;

  return (
    <>
      {/* Title Group */}
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
            Book a Class Time
          </h1>
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
            Select a Friday and up to 3 time preferences in order of priority
          </p>
        </div>
      </div>

      {/* Form Inner Container */}
      <div className="form-inner" style={{ width: '100%', margin: '24px 0 0 0' }}>
        <Form {...form}>
          <form className="timePref-formContainer" onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', padding: '16px 20px' }}>
            
            {/* Calendar Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Select a Friday</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => !isFriday(date)}
                  className="rounded-md border"
                />
              </div>
              {selectedDate && (
                <p className="text-center text-sm text-slate-600 mt-2">
                  Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">Available Times</h3>
              <div className="grid grid-cols-5 gap-2">
                {availableTimes.map((time) => {
                  const isSelected = selectedTimes.includes(time);
                  const priorityIndex = selectedTimes.indexOf(time);
                  
                  return (
                    <div key={time} className="relative">
                      <button
                        type="button"
                        className={`time-slot-button w-full py-2 px-3 text-sm border rounded-md transition-colors ${
                          isSelected 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                        onClick={() => handleTimeSelection(time)}
                        disabled={!isSelected && selectedTimes.length >= 3}
                      >
                        {time}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {priorityIndex + 1}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <FormField
                control={form.control}
                name="timePreferences"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Selected Times Summary */}
            {selectedTimes.length > 0 && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-700 mb-2">Your time preferences (in priority order):</div>
                <div className="space-y-1">
                  {selectedTimes.map((time, index) => (
                    <div key={time} className="text-sm text-slate-600">
                      {index + 1}. {time}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Class Preference Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">My class preference</h3>
              <div className="space-y-3">
                {[
                  { value: "mat", label: "Mat Pilates", desc: "Floor-based exercises using body weight and small props" },
                  { value: "reformer", label: "Reformer Pilates", desc: "Equipment-based exercises using the Pilates reformer machine" },
                  { value: "both", label: "Both", desc: "A combination of Mat and Reformer exercises" }
                ].map((option) => (
                  <div key={option.value}>
                    <button
                      type="button"
                      className={`w-full text-left p-4 border rounded-lg transition-colors ${
                        selectedClassType === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleClassTypeSelect(option.value as "mat" | "reformer" | "both")}
                    >
                      <div className="font-medium text-slate-800">{option.label}</div>
                      <div className="text-sm text-slate-600 mt-1">{option.desc}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Preference Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-3">I want my class in</h3>
              <div className="flex gap-4">
                {[
                  { value: "english", label: "English" },
                  { value: "spanish", label: "Español" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex-1 p-3 border rounded-lg transition-colors ${
                      selectedLanguage === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleLanguageSelect(option.value as "english" | "spanish")}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onPrevious}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                type="submit"
                disabled={!isFormValid}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}