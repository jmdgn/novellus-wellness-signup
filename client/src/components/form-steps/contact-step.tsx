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
    <div className="form-card">
      <div className="form-frame">
        {/* Title Group - Outside form-inner, positioned at top */}
        <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '510px', display: 'flex', padding: '24px 24px 0 24px' }}>
          <div style={{ width: '223px', height: '32px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
              Reserve your spot
            </h1>
          </div>
          <div style={{ width: '510px', height: '40px' }}>
            <p style={{ fontSize: '14px', color: '#666', margin: '0', lineHeight: '1.4' }}>
              Reserve your spot today for our introductory Pilates class and start your journey to wellness!
            </p>
          </div>
        </div>

        {/* Form Inner Container */}
        <div className="form-inner">
          {/* Class Info Header */}
          <div className="form-title-container">
            <div style={{ flexShrink: 0, width: '284px', height: '20px' }}>
              <div className="form-title">Introduction Pilates Session | 1hr Class</div>
            </div>
            <div style={{ flexShrink: 0, width: '76px', height: '20px' }}>
              <div className="form-price">$20.00 AUD</div>
            </div>
          </div>

          {/* Contact Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* First Name & Last Name Row */}
              <div className="field-row" style={{ display: 'flex', gap: '12px' }}>
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
              <div className="field-row">
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
              <div className="field-row">
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

        {/* Navigation Button - Outside form-inner */}
        <div className="next-button-container">
          <div style={{ flexShrink: 0, width: '64px', height: '20px' }}>
            <div className="step-text">Step 1 of 4</div>
          </div>
          <div style={{ flexShrink: 0, width: '56px', height: '20px' }}>
            <button 
              onClick={form.handleSubmit(onSubmit)} 
              className="action-text" 
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Next step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
