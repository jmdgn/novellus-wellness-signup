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
  { id: "other", label: "Other" }
];

export default function MedicalDeclarationStep({ data, onUpdate, onNext, onPrevious }: MedicalDeclarationStepProps) {
  const [selectedPainAreas, setSelectedPainAreas] = useState<string[]>(data?.painAreas || []);
  const [isPregnant, setIsPregnant] = useState<boolean>(data?.isPregnant || false);
  const [showMedicalConditions, setShowMedicalConditions] = useState<boolean>(false);

  const form = useForm<MedicalDeclaration>({
    resolver: zodResolver(medicalDeclarationSchema),
    defaultValues: {
      painAreas: data?.painAreas || [],
      isPregnant: data?.isPregnant || false,
      medicalConditions: data?.medicalConditions || "",
      hasMedicalConditions: data?.hasMedicalConditions || false,
    },
  });

  // Update medical conditions visibility when pain areas or pregnancy status changes
  useEffect(() => {
    const hasMedicalIssues = selectedPainAreas.length > 0 || isPregnant;
    setShowMedicalConditions(hasMedicalIssues);
    form.setValue("hasMedicalConditions", hasMedicalIssues);
  }, [selectedPainAreas, isPregnant, form]);

  const handlePainAreaChange = (areaId: string, checked: boolean) => {
    let newPainAreas: string[];
    
    if (checked) {
      newPainAreas = [...selectedPainAreas, areaId];
    } else {
      newPainAreas = selectedPainAreas.filter(area => area !== areaId);
    }
    
    setSelectedPainAreas(newPainAreas);
    form.setValue("painAreas", newPainAreas as any);
  };

  const handlePregnancyChange = (value: string) => {
    const pregnant = value === "yes";
    setIsPregnant(pregnant);
    form.setValue("isPregnant", pregnant);
  };

  const onSubmit = (values: MedicalDeclaration) => {
    onUpdate(values);
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Medical History & Information</h1>
        <p className="text-slate-600 text-sm">
          <strong>Important:</strong> Please answer these questions as honestly as you can and to the best of your knowledge.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Question 1: Pain History */}
          <div className="bg-slate-50 rounded-lg p-4">
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
                <FormField
                  key={area.id}
                  control={form.control}
                  name="painAreas"
                  render={() => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={selectedPainAreas.includes(area.id)}
                          onCheckedChange={(checked) => handlePainAreaChange(area.id, !!checked)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-slate-700 cursor-pointer">
                        {area.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question 2: Pregnancy */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div className="text-sm font-medium text-slate-800">
                Are you pregnant?
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="isPregnant"
              render={() => (
                <FormItem className="ml-9">
                  <FormControl>
                    <RadioGroup
                      value={isPregnant ? "yes" : "no"}
                      onValueChange={handlePregnancyChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pregnancy-yes" />
                        <FormLabel htmlFor="pregnancy-yes" className="text-sm text-slate-700 cursor-pointer">
                          Yes
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pregnancy-no" />
                        <FormLabel htmlFor="pregnancy-no" className="text-sm text-slate-700 cursor-pointer">
                          No
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Conditional Medical Conditions Text Area */}
          {showMedicalConditions && (
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
                      className="focus-ring min-h-[100px]"
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
            <Button
              type="button"
              variant="ghost"
              onClick={onPrevious}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="step-indicator">Step 3 of 4</div>
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
