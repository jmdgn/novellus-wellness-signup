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
      {/* Header Section with Class Info */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.2' }}>
              Try Novellus Pilates
            </h1>
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#111', margin: '8px 0 0 0', lineHeight: '1.3' }}>
              with Beatriz Durango
            </p>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616c9e98c53?w=120&h=120&fit=crop&crop=face"
              alt="Beatriz Durango"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.5' }}>
            Book your 2x 1-hour introduction classes at{' '}
            <span style={{ color: '#3B82F6', textDecoration: 'underline' }}>
              316-320 Toorak Road, South Yarra
            </span>{' '}
            for just $30. A special discounted rate to experience semi-private pilates in our boutique studio. One-time payment, no subscription.
          </p>
        </div>

        {/* Class Info Card */}
        <div style={{ 
          width: '100%', 
          backgroundColor: '#F8F9FA', 
          borderRadius: '12px', 
          padding: '16px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=160&h=120&fit=crop"
              alt="Pilates Studio"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
              2x 1hr Semi-Private Pilates Classes
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
              Choose between Mat, Reformer or both in a class no larger than 3 people.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="#666"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>18 July, 2025</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>$30.00 AUD</span>
          </div>
        </div>
      </div>

      {/* Book a Class Section */}
      <div style={{ width: '100%', marginTop: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
            Book a Class
          </h2>
          <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
            Select a Friday and up to 3 time preferences in order of priority
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%' }}>
            
            {/* Calendar Section */}
            <div style={{ marginBottom: '40px' }}>
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
                <p className="text-center text-sm text-slate-600 mt-3">
                  Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1e293b', marginBottom: '16px' }}>Available Times</h3>
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
              <div style={{ marginBottom: '40px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
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
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1e293b', marginBottom: '16px' }}>My class preference</h3>
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
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1e293b', marginBottom: '16px' }}>I want my class in</h3>
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


          </form>
        </Form>
      </div>

      {/* Navigation Container - Step 1 has no Previous button */}
      <div className="button-containerFull" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        width: '100%', 
        margin: '24px 0 0 0',
        position: 'relative'
      }}>
        {/* Next Button - Step 1 only */}
        <div 
          className="next-button-container" 
          style={{ 
            flex: 1,
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            border: isFormValid ? '1px solid #111111' : '1px solid #CCC',
            background: isFormValid ? '#111111' : '#fff',
            color: isFormValid ? '#FFF' : '#111',
            opacity: isFormValid ? 1 : 0.6
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
      </div>
    </>
  );
}