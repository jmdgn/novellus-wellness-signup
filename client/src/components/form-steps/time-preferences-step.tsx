import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timePreferencesSchema, type TimePreferences } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
    name: "Morning",
    time: "7.00 am to 11.00 am",
    icon: Sun,
    iconColor: "text-yellow-500"
  },
  {
    id: "afternoon", 
    name: "Afternoon",
    time: "1.00 pm to 3.00 pm",
    icon: Sun,
    iconColor: "text-orange-500"
  },
  {
    id: "evening",
    name: "Evening", 
    time: "5.00 pm to 7.00 pm",
    icon: Moon,
    iconColor: "text-indigo-500"
  }
];

export default function TimePreferencesStep({ data, onUpdate, onNext, onPrevious }: TimePreferencesStepProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>(data?.timePreferences || []);
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "spanish">(data?.language || "english");

  const form = useForm<TimePreferences>({
    resolver: zodResolver(timePreferencesSchema),
    defaultValues: {
      timePreferences: data?.timePreferences || [],
      language: data?.language || "english",
    },
  });

  const handleTimeSlotToggle = (slotId: string) => {
    const currentIndex = selectedSlots.indexOf(slotId);
    let newSelectedSlots: string[];

    if (currentIndex > -1) {
      // Remove if already selected
      newSelectedSlots = selectedSlots.filter(slot => slot !== slotId);
    } else if (selectedSlots.length < 3) {
      // Add if under limit
      newSelectedSlots = [...selectedSlots, slotId];
    } else {
      // Already at limit
      return;
    }

    setSelectedSlots(newSelectedSlots);
    form.setValue("timePreferences", newSelectedSlots as ("morning" | "afternoon" | "evening")[]);
  };

  const handleLanguageSelect = (language: "english" | "spanish") => {
    setSelectedLanguage(language);
    form.setValue("language", language);
  };

  const onSubmit = (values: TimePreferences) => {
    if (values.timePreferences.length === 0) {
      form.setError("timePreferences", { message: "Please select at least one time preference" });
      return;
    }
    onUpdate(values);
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Book a Class Time</h1>
        <p className="text-slate-600 text-sm">
          Select 3x time preferences | Select in order of priority
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Time Preference Options */}
          <div className="space-y-4 mb-6">
            {timeSlots.map((slot, index) => {
              const Icon = slot.icon;
              const isSelected = selectedSlots.includes(slot.id);
              const priorityIndex = selectedSlots.indexOf(slot.id);
              
              return (
                <div
                  key={slot.id}
                  className={`time-slot-card relative ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotToggle(slot.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`${slot.iconColor} text-lg`} />
                      <div>
                        <div className="font-medium text-slate-800">{slot.name}</div>
                        <div className="text-sm text-slate-600">{slot.time}</div>
                      </div>
                    </div>
                    <ChevronLeft className="text-slate-400 rotate-180" size={16} />
                  </div>
                  
                  {isSelected && (
                    <div className="priority-badge">
                      {priorityIndex + 1}
                    </div>
                  )}
                </div>
              );
            })}
            
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

          {/* Language Preference */}
          <div className="mb-6">
            <div className="text-sm text-slate-600 mb-3">I want my class in:</div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={selectedLanguage === "english" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleLanguageSelect("english")}
              >
                English
              </Button>
              <Button
                type="button"
                variant={selectedLanguage === "spanish" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleLanguageSelect("spanish")}
              >
                Español
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onPrevious}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="step-indicator">Step 2 of 4</div>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6 py-3"
            >
              Next step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
