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

            {/* Navigation - Step 2 has both Previous and Next */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderTop: '1px solid #E5E7EB',
              marginTop: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                  Step 2 of 4
                </div>
                <Button
                  type="button"
                  onClick={onPrevious}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={!isFormValid}
                style={{
                  backgroundColor: isFormValid ? '#111' : '#E5E7EB',
                  color: isFormValid ? '#FFF' : '#9CA3AF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isFormValid ? 'pointer' : 'not-allowed'
                }}
              >
                Next step
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}