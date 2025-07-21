import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

interface ContactStepProps {
  data?: Partial<ContactInfo>;
  onUpdate: (data: ContactInfo) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ContactStep({ data, onUpdate, onNext, onPrevious }: ContactStepProps) {
  const { toast } = useToast();
  
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

  return (
    <>
      {/* Title Group */}
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
            Your Details
          </h1>
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
            Please provide your contact information and emergency contact details
          </p>
        </div>
      </div>

      {/* Form Inner Container */}
      <div className="form-inner" style={{ width: '100%', margin: '24px 0 0 0' }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', padding: '16px 20px' }}>
            
            {/* Main Contact Details */}
            <div className="space-y-4 mb-6">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jane" 
                          className="border-slate-200"
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
                          className="border-slate-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0400 000 000" 
                        className="border-slate-200"
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

              {/* Email Address */}
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
                        className="border-slate-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Emergency Contact Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Emergency contact full name" 
                          className="border-slate-200"
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
                          className="border-slate-200"
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
      </div>

      {/* Navigation Container - Step 2 has both Previous and Next */}
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
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            border: isFormValid ? '1px solid #111111' : '1px solid #CCC',
            background: isFormValid ? '#111111' : '#fff',
            color: isFormValid ? '#FFF' : '#111',
            opacity: isFormValid ? 1 : 0.6
          }}
          onClick={isFormValid ? form.handleSubmit(onSubmit) : undefined}
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