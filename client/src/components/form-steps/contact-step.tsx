import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

interface ContactStepProps {
  data?: Partial<ContactInfo>;
  onUpdate: (data: ContactInfo) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ContactStep({ data, onUpdate, onNext, onPrevious }: ContactStepProps) {
  const { toast } = useToast();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  
  const form = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phoneNumber: data?.phoneNumber || "",
      email: data?.email || "",
      emergencyContactName: data?.emergencyContactName || "",
      emergencyContactPhone: data?.emergencyContactPhone || "",
      language: data?.language || "english",
    },
  });

  const onSubmit = (values: ContactInfo) => {
    // Ensure language is set
    const completeValues = {
      ...values,
      language: "english" as "english" | "spanish"
    };
    onUpdate(completeValues);
    onNext();
  };

  // Check if main contact details are completed
  const mainDetailsCompleted = form.watch("firstName") && 
    form.watch("lastName") && 
    form.watch("phoneNumber") && 
    form.watch("email");

  // Check if ALL fields on the page are filled (including emergency contact)
  const allFieldsCompleted = mainDetailsCompleted && 
    form.watch("emergencyContactName") && 
    form.watch("emergencyContactPhone");

  // Check if all required fields are filled
  const isFormValid = allFieldsCompleted && form.formState.isValid;

  // IMPROVED: Phone number formatting that's more user-friendly for deletion
  const handlePhoneChange = (value: string) => {
    // Allow empty value
    if (!value) return '';
    
    // Only format when user is not in the middle of deleting
    // This gives users more control over deletion
    const cleaned = value.replace(/\D/g, '');
    
    // Don't over-format - only format complete groups
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    } else {
      // Limit to 10 digits and format
      const truncated = cleaned.slice(0, 10);
      return `${truncated.slice(0, 4)} ${truncated.slice(4, 7)} ${truncated.slice(7)}`;
    }
  };

  // Helper function to validate phone numbers manually
  const isPhoneValid = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    // Must be exactly 10 digits and start with 04 for mobile or 0[2-9] for landline
    return /^(0[2-9]\d{8}|04\d{8})$/.test(cleaned);
  };

  // Helper function to validate email manually
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to check missing fields and show tooltip
  const checkMissingFields = () => {
    const values = form.getValues();
    const missingFields = [];

    if (!values.firstName) missingFields.push("First Name");
    if (!values.lastName) missingFields.push("Last Name");
    if (!values.phoneNumber || !isPhoneValid(values.phoneNumber)) missingFields.push("Valid Phone Number");
    if (!values.email || !isEmailValid(values.email)) missingFields.push("Valid Email Address");
    if (!values.emergencyContactName) missingFields.push("Emergency Contact Name");
    if (!values.emergencyContactPhone || !isPhoneValid(values.emergencyContactPhone)) missingFields.push("Valid Emergency Contact Phone");

    if (missingFields.length > 0) {
      const message = missingFields.length === 1 
        ? `Please complete: ${missingFields[0]}`
        : `Please complete: ${missingFields.slice(0, -1).join(", ")} and ${missingFields[missingFields.length - 1]}`;
      
      setTooltipMessage(message);
      setShowTooltip(true);
      
      // Hide tooltip after 4 seconds
      setTimeout(() => setShowTooltip(false), 4000);
      
      return false;
    }
    return true;
  };

  const handleNextClick = () => {
    if (checkMissingFields()) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      {/* Title Group */}
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <h1 className="text-[18px] font-semibold leading-6 tracking-[-0.22px] text-black">
            Your Details
          </h1>
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
            Please provide your contact information and emergency contact details
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full" style={{ margin: '16px 0 0 0' }}>
          
          {/* Your Details Section */}
          <div className="w-full mb-6">
            <div className="space-y-4">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Jane" 
                            className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                            data-valid={!!field.value && !form.formState.errors.firstName}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Citizen" 
                            className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                            data-valid={!!field.value && !form.formState.errors.lastName}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              {/* Phone Number & Email Address Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0400 000 000" 
                            className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                            data-valid={!!field.value && !form.formState.errors.phoneNumber && isPhoneValid(field.value)}
                            {...field}
                            onChange={(e) => {
                              const formatted = handlePhoneChange(e.target.value);
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="jane.citizen@email.com" 
                            className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                            data-valid={!!field.value && !form.formState.errors.email && isEmailValid(field.value)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section - White Panel */}
          <div className="w-full mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Emergency contact full name" 
                          className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                          data-valid={!!field.value && !form.formState.errors.emergencyContactName}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0400 000 000" 
                          className="border-[#CCC] rounded-[8px] data-[valid=true]:border-[#0095F6]"
                          data-valid={!!field.value && !form.formState.errors.emergencyContactPhone && isPhoneValid(field.value)}
                          {...field}
                          onChange={(e) => {
                            const formatted = handlePhoneChange(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

        </form>
      </Form>

      {/* Navigation Container - Step 1 only has Next button */}
      <div className="button-containerFull" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        width: '100%', 
        margin: '24px 0 0 0',
        position: 'relative'
      }}>
        {/* Next Button */}
        <div 
          className="next-button-container" 
          style={{ 
            flex: 1,
            cursor: 'pointer',
            border: isFormValid ? '1px solid #111111' : '1px solid #CCC',
            background: isFormValid ? '#111111' : '#fff',
            color: isFormValid ? '#FFF' : '#111',
            position: 'relative'
          }}
          onClick={handleNextClick}
        >
          {/* Tooltip */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#333',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              marginBottom: '8px',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {tooltipMessage}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid #333'
              }} />
            </div>
          )}
          <div style={{ flexShrink: 0 }}>
            <div className="step-text" style={{ color: 'inherit' }}>Step 1 of 2</div>
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