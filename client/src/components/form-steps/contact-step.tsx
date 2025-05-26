import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ContactStepProps {
  data?: Partial<ContactInfo>;
  onUpdate: (data: ContactInfo) => void;
  onNext: () => void;
}

export default function ContactStep({ data, onUpdate, onNext }: ContactStepProps) {
  const { toast } = useToast();
  
  const form = useForm<ContactInfo>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phoneNumber: data?.phoneNumber || "",
      email: data?.email || "",
    },
  });

  const onSubmit = (values: ContactInfo) => {
    onUpdate(values);
    onNext();
  };

  // Check if all required fields are filled
  const isFormValid = form.formState.isValid && 
    form.watch("firstName") && 
    form.watch("lastName") && 
    form.watch("phoneNumber") && 
    form.watch("email");

  const handlePhoneChange = (value: string) => {
    // Format Australian phone number as user types
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.startsWith('61')) {
      formatted = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      if (cleaned.length > 4) {
        formatted = cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7, 10);
      }
    }
    
    return formatted.slice(0, 15); // Limit length
  };

  return (
    <>
      {/* Title Group */}
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
            Try Novellus Clinical Pilates
          </h1>
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
          <img 
            src="/attached_assets/Profile Image.png" 
            alt="Beatriz Durango" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              backgroundColor: '#F9F9F9'
            }} 
          />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.4' }}>
            with Beatriz Durango
          </h2>
        </div>
        <div style={{ width: '100%' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
            Book your 1-hour introduction class at{' '}
            <a 
              href="https://maps.google.com/?q=316-320+Toorak+Road+South+Yarra+VIC+Australia" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0095F6', textDecoration: 'underline' }}
            >
              316-320 Toorak Road, South Yarra
            </a>{' '}
            for just $20 — a special discounted rate to experience clinical pilates. One-time payment, no subscription.
          </p>
        </div>
      </div>
      {/* Form Inner Container */}
      <div className="form-inner pl-[0px] pr-[0px] pt-[8px] pb-[8px]" style={{ width: '100%', margin: '24px 0 0 0' }}>
        {/* Class Info Header */}
        <div className="form-title-container" style={{ width: '100%' }}>
          <div style={{ flexShrink: 0 }}>
            <div className="form-title pl-[20px] pr-[20px]">Your details</div>
          </div>
        </div>

        {/* Contact Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', padding: '16px 20px' }}>
            {/* First Name & Last Name Row */}
            <div className="field-row" style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem style={{ flex: 1 }}>
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block' }}>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jane" 
                        className="form-field"
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
                  <FormItem style={{ flex: 1 }}>
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block' }}>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Citizen" 
                        className="form-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Number Row */}
            <div className="field-row" style={{ width: '100%' }}>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block' }}>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0400 000 000" 
                        className="form-field"
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

            {/* Email Address Row */}
            <div className="field-row" style={{ width: '100%' }}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block' }}>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="jane.citizen@email.com" 
                        className="form-field"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      {/* Navigation Button */}
      <div 
        className="next-button-container" 
        style={{ 
          width: '100%', 
          margin: '24px 0', 
          cursor: 'pointer',
          border: isFormValid ? '1px solid #111111' : '1px solid #111',
          background: isFormValid ? '#111111' : '#fff',
          color: isFormValid ? '#FFF' : '#111'
        }}
        onClick={form.handleSubmit(onSubmit)}
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
    </>
  );
}
