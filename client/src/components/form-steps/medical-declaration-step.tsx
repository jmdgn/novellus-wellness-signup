import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicalDeclarationSchema, type MedicalDeclaration } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface MedicalDeclarationStepProps {
  data?: Partial<MedicalDeclaration>;
  onUpdate: (data: MedicalDeclaration) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const painAreas = [
  { id: "neck", label: "Neck" },
  { id: "shoulders", label: "Shoulders" }, 
  { id: "back", label: "Back" },
  { id: "hips", label: "Hips" },
  { id: "knees", label: "Knees" },
  { id: "ankles", label: "Ankles" },
  { id: "other", label: "Other" },
  { id: "none", label: "None" }
];

type ResponseKey = "isPregnant" | "heartCondition" | "chestPain" | "dizziness" | "asthmaAttack" | "diabetesControl" | "otherConditions";

const healthQuestions = [
  {
    id: "isPregnant",
    question: "Are you pregnant?",
    key: "isPregnant" as ResponseKey
  },
  {
    id: "heartCondition", 
    question: "Has your medical practitioner ever told you that you have a heart condition, or have you ever suffered a stroke?",
    key: "heartCondition" as ResponseKey
  },
  {
    id: "chestPain",
    question: "Do you ever experience unexplained pains or discomfort in your chest at rest or during physical exercise / Activity?",
    key: "chestPain" as ResponseKey
  },
  {
    id: "dizziness",
    question: "Do you ever feel faint, dizzy, or lose balance during physical activity / exercise?",
    key: "dizziness" as ResponseKey
  },
  {
    id: "asthmaAttack",
    question: "Have you had an asthma attack requiring immediate medical attention at any time over the last 12 months?",
    key: "asthmaAttack" as ResponseKey
  },
  {
    id: "diabetesControl",
    question: "If you have diabetes (type 1 or 2), have you had trouble controlling your blood sugar (glucose) in the last 3 months?",
    key: "diabetesControl" as ResponseKey
  },
  {
    id: "otherConditions",
    question: "Do you have any other conditions that may require special consideration for you to exercise?",
    key: "otherConditions" as ResponseKey
  }
];

export default function MedicalDeclarationStep({ data, onUpdate, onNext, onPrevious }: MedicalDeclarationStepProps) {
  const [selectedPainAreas, setSelectedPainAreas] = useState<string[]>(data?.painAreas || []);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | undefined>(data?.pregnancyWeeks);
  const [responses, setResponses] = useState<{
    isPregnant: boolean | null;
    heartCondition: boolean | null;
    chestPain: boolean | null;
    dizziness: boolean | null;
    asthmaAttack: boolean | null;
    diabetesControl: boolean | null;
    otherConditions: boolean | null;
  }>({
    isPregnant: data?.isPregnant ?? null,
    heartCondition: data?.heartCondition ?? null,
    chestPain: data?.chestPain ?? null,
    dizziness: data?.dizziness ?? null,
    asthmaAttack: data?.asthmaAttack ?? null,
    diabetesControl: data?.diabetesControl ?? null,
    otherConditions: data?.otherConditions ?? null,
  });

  const form = useForm<MedicalDeclaration>({
    resolver: zodResolver(medicalDeclarationSchema),
    defaultValues: {
      painAreas: data?.painAreas || [],
      isPregnant: data?.isPregnant ?? false,
      pregnancyWeeks: data?.pregnancyWeeks,
      heartCondition: data?.heartCondition ?? false,
      chestPain: data?.chestPain ?? false,
      dizziness: data?.dizziness ?? false,
      asthmaAttack: data?.asthmaAttack ?? false,
      diabetesControl: data?.diabetesControl ?? false,
      otherConditions: data?.otherConditions ?? false,
      medicalConditions: data?.medicalConditions || "",
      hasMedicalConditions: data?.hasMedicalConditions || false,
    },
  });

  // Update medical conditions visibility when any medical issues are present
  useEffect(() => {
    const hasAnyMedicalIssues = selectedPainAreas.length > 0 || Object.values(responses).some(Boolean);
    form.setValue("hasMedicalConditions", hasAnyMedicalIssues);
  }, [selectedPainAreas, responses, form]);

  const handlePainAreaChange = (areaId: string, checked: boolean) => {
    let newPainAreas: string[];
    
    if (areaId === "none") {
      // If "None" is selected, clear all other selections
      newPainAreas = checked ? ["none"] : [];
    } else {
      // If any other area is selected, remove "none" first
      const areasWithoutNone = selectedPainAreas.filter(area => area !== "none");
      if (checked) {
        newPainAreas = [...areasWithoutNone, areaId];
      } else {
        newPainAreas = areasWithoutNone.filter(area => area !== areaId);
      }
    }
    
    setSelectedPainAreas(newPainAreas);
    form.setValue("painAreas", newPainAreas as any);
  };

  const handleResponseChange = (questionKey: ResponseKey, value: boolean) => {
    const newResponses = { ...responses, [questionKey]: value };
    setResponses(newResponses);
    form.setValue(questionKey, value);
    
    // If pregnancy is set to false, clear pregnancy weeks
    if (questionKey === "isPregnant" && !value) {
      setPregnancyWeeks(undefined);
      form.setValue("pregnancyWeeks", undefined);
    }
  };

  const handlePregnancyWeeksChange = (weeks: number) => {
    setPregnancyWeeks(weeks);
    form.setValue("pregnancyWeeks", weeks);
  };

  const onSubmit = (values: MedicalDeclaration) => {
    // Check if all questions have been answered
    const allQuestionsAnswered = Object.values(responses).every(response => response !== null);
    
    if (!allQuestionsAnswered) {
      // Find which questions are unanswered and show error
      healthQuestions.forEach((question) => {
        if (responses[question.key] === null) {
          form.setError(question.key, { message: "Please answer this question" });
        }
      });
      return;
    }

    // If pregnant, require pregnancy weeks
    if (responses.isPregnant && !pregnancyWeeks) {
      form.setError("pregnancyWeeks", { message: "Please specify how many weeks pregnant you are" });
      return;
    }

    onUpdate(values);
    onNext();
  };

  const hasAnyYesAnswers = Object.values(responses).some(response => response === true);
  const allQuestionsAnswered = Object.values(responses).every(response => response !== null);

  return (
    <div className="form-inner">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Medical History & Information</h1>
        <p className="text-slate-600 text-sm">
          <strong>Important:</strong> Please answer these questions as honestly as you can and to the best of your knowledge.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Question 1: Pain History */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div className="text-sm font-medium text-slate-800">
                Have you ever had undiagnosed pain in any of the following areas?
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 ml-9">
              {painAreas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className={`time-slot-button ${selectedPainAreas.includes(area.id) ? 'selected' : ''}`}
                  onClick={() => handlePainAreaChange(area.id, !selectedPainAreas.includes(area.id))}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Health Questions 2-8 */}
          {healthQuestions.map((question, index) => (
            <div key={question.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 2}
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {question.question}
                </div>
              </div>
              
              <div className="ml-9 flex space-x-3">
                <button
                  type="button"
                  className={`time-slot-button ${responses[question.key] === true ? 'selected' : ''}`}
                  onClick={() => handleResponseChange(question.key, true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`time-slot-button ${responses[question.key] === false ? 'selected' : ''}`}
                  onClick={() => handleResponseChange(question.key, false)}
                >
                  No
                </button>
              </div>

              {/* Pregnancy weeks field - show only for pregnancy question when Yes is selected */}
              {question.key === "isPregnant" && responses.isPregnant === true && (
                <div className="ml-9 mt-4">
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    How long have you been pregnant (in weeks)?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={pregnancyWeeks || ''}
                    onChange={(e) => handlePregnancyWeeksChange(parseInt(e.target.value) || 0)}
                    className="form-field w-32"
                    placeholder="0"
                  />
                  {form.formState.errors.pregnancyWeeks && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.pregnancyWeeks.message}
                    </p>
                  )}
                </div>
              )}

              {/* Show validation errors for unanswered questions */}
              {form.formState.errors[question.key] && (
                <div className="ml-9 mt-2">
                  <p className="text-red-500 text-xs">
                    {form.formState.errors[question.key]?.message}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Medical Clearance Notice */}
          {hasAnyYesAnswers && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-sm text-amber-800">
                <strong>IF YOU ANSWERED 'YES' to any of the 7 questions above</strong>, please seek guidance from an appropriate allied health professional or medical practitioner prior to undertaking exercise to gain clearance &amp; / or provide evidence of clearance.
              </div>
            </div>
          )}

          {/* Conditional Medical Conditions Text Area */}
          {(selectedPainAreas.length > 0 || hasAnyYesAnswers) && (
            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Please describe any medical conditions or concerns:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your medical conditions..."
                      className="form-field min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onPrevious}
              className="form-button-outline flex items-center space-x-2"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="step-indicator">Step 3 of 4</div>
            <button 
              type="submit"
              disabled={!allQuestionsAnswered}
              className={`form-button ${!allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next step
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
