import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timePreferencesSchema, type TimePreferences } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { ChevronLeft, Sun, Sunset, Moon } from "lucide-react";

interface TimePreferencesStepProps {
  data?: Partial<TimePreferences>;
  onUpdate: (data: TimePreferences) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const timeSlots = [
  {
    id: "morning",
    name: "Morning - 18 July 2025",
    time: "7.00 am to 11.00 am",
    icon: Sun,
    iconColor: "text-yellow-500",
    times: ["7.00 am", "8.00 am", "9.00 am", "10.00 am"]
  },
  {
    id: "afternoon", 
    name: "Afternoon - 18 July 2025",
    time: "1.00 pm to 3.00 pm",
    icon: Sun,
    iconColor: "text-orange-500",
    times: ["1.00 pm", "2.00 pm", "3.00 pm"]
  },
  {
    id: "evening",
    name: "Evening - 18 July 2025", 
    time: "5.00 pm to 7.00 pm",
    icon: Moon,
    iconColor: "text-indigo-500",
    times: ["5.00 pm", "6.00 pm", "7.00 pm"]
  }
];

export default function TimePreferencesStep({ data, onUpdate, onNext, onPrevious }: TimePreferencesStepProps) {
  const [selectedTimes, setSelectedTimes] = useState<string[]>(data?.timePreferences || []);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "spanish">(data?.language || "english");
  const [selectedClassType, setSelectedClassType] = useState<"mat" | "reformer" | "both">(data?.classType || "mat");

  const form = useForm<TimePreferences>({
    resolver: zodResolver(timePreferencesSchema),
    defaultValues: {
      timePreferences: data?.timePreferences || [],
      classType: data?.classType || "mat",
      language: data?.language || "english",
    },
  });

  const handleTimeSelection = (timeSlot: string) => {
    const currentIndex = selectedTimes.indexOf(timeSlot);
    let newSelectedTimes: string[];

    if (currentIndex > -1) {
      // Remove if already selected
      newSelectedTimes = selectedTimes.filter(time => time !== timeSlot);
    } else if (selectedTimes.length < 3) {
      // Add if under limit
      newSelectedTimes = [...selectedTimes, timeSlot];
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
    onUpdate(values);
    onNext();
  };

  // Check if form is valid (at least one time selected)
  const isFormValid = selectedTimes.length > 0;

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
            Select 3x time preferences | Select in order of priority
          </p>
        </div>
      </div>

      {/* Form Inner Container */}
      <div className="form-inner" style={{ width: '100%', margin: '24px 0 0 0' }}>
        <Form {...form}>
          <form className="timePref-formContainer" onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', padding: '16px 20px' }}>
          {/* Accordion Time Slots */}
          <div className="space-y-4 mb-6">
            <Accordion type="multiple" className="space-y-3">
              {timeSlots.map((slot) => {
                const Icon = slot.icon;
                
                return (
                  <AccordionItem key={slot.id} value={slot.id} className="accordion-item">
                    <AccordionTrigger className="accordion-trigger">
                      <div className="flex items-center space-x-3">
                        <Icon className={`${slot.iconColor} text-lg`} />
                        <div className="text-left">
                          <div className="font-medium text-slate-800">{slot.name}</div>
                          <div className="text-sm text-slate-600">{slot.time}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {slot.times.map((timeSlot) => {
                          const isSelected = selectedTimes.includes(timeSlot);
                          const priorityIndex = selectedTimes.indexOf(timeSlot);
                          
                          return (
                            <div key={timeSlot} className="relative">
                              <button
                                type="button"
                                className={`time-slot-button w-full ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleTimeSelection(timeSlot)}
                                disabled={!isSelected && selectedTimes.length >= 3}
                              >
                                {timeSlot}
                                {isSelected && (
                                  <div className="priority-badge">
                                    {priorityIndex + 1}
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
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
              <div className="text-sm font-medium text-slate-700 mb-2">Your class time choices:</div>
              <div className="space-y-1">
                {selectedTimes.map((time, index) => (
                  <div key={time} className="text-sm text-slate-600">
                    <span className="font-medium">{index + 1}.</span> {time}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class Type Preference */}
          <div className="mb-6">
            <div className="text-sm text-slate-600 mb-3">My class preference is:</div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={selectedClassType === "mat" ? "default" : "outline"}
                className="flex-1"
                style={{ height: '52px', borderRadius: '8px' }}
                onClick={() => handleClassTypeSelect("mat")}
              >
                Mat
              </Button>
              <Button
                type="button"
                variant={selectedClassType === "reformer" ? "default" : "outline"}
                className="flex-1"
                style={{ height: '52px', borderRadius: '8px' }}
                onClick={() => handleClassTypeSelect("reformer")}
              >
                Reformer
              </Button>
              <Button
                type="button"
                variant={selectedClassType === "both" ? "default" : "outline"}
                className="flex-1"
                style={{ height: '52px', borderRadius: '8px' }}
                onClick={() => handleClassTypeSelect("both")}
              >
                Both
              </Button>
            </div>
          </div>

          {/* Language Preference */}
          <div className="mb-6">
            <div className="text-sm text-slate-600 mb-3">I want my class in:</div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={selectedLanguage === "english" ? "default" : "outline"}
                className="flex-1"
                style={{ height: '52px', borderRadius: '8px' }}
                onClick={() => handleLanguageSelect("english")}
              >
                English
              </Button>
              <Button
                type="button"
                variant={selectedLanguage === "spanish" ? "default" : "outline"}
                className="flex-1"
                style={{ height: '52px', borderRadius: '8px' }}
                onClick={() => handleLanguageSelect("spanish")}
              >
                Español
              </Button>
            </div>
          </div>

            </form>
          </Form>
        </div>

        {/* Navigation Container */}
        <div className="button-containerFull" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          width: '100%', 
          margin: '24px 0 0 0',
          position: 'relative'
        }}>
          {/* Previous Button */}
          <div 
            style={{ 
              width: '55px',
              height: '55px',
              border: '1px solid #CCC',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.2s ease'
            }}
            onClick={onPrevious}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F9F9F9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            <ChevronLeft size={16} color="#111" />
          </div>

          {/* Next Button */}
          <div 
            className="next-button-container" 
            style={{ 
              flex: 1,
              cursor: 'pointer',
              border: isFormValid ? '1px solid #111111' : '1px solid #111',
              background: isFormValid ? '#111111' : '#fff',
              color: isFormValid ? '#FFF' : '#111'
            }}
            onClick={form.handleSubmit(onSubmit)}
          >
            <div style={{ flexShrink: 0 }}>
              <div className="step-text" style={{ color: 'inherit' }}>Step 2 of 4</div>
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
