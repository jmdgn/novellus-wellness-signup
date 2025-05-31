import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import profileImg from "@assets/profile-img.png";

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
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
              Try Novellus Pilates
            </h1>
            <img 
              src={profileImg} 
              alt="Beatriz Durango" 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                backgroundColor: '#F9F9F9'
              }} 
            />
          </div>
          <div style={{ width: '100%', margin: '4px 0 0 0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.4' }}>
              with Beatriz Durango
            </h2>
          </div>
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
            for just $30 — a special discounted rate to experience semi-private pilates in our boutique studio. One-time payment, no subscription.
          </p>
        </div>
      </div>

      {/* Class Information Panel */}
      <div class="info-panel-full" style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        width: '100%', 
        height: '180px', 
        boxShadow: '2px 2px 16px rgba(0, 0, 0, 0.12)',
        margin: '24px 0 0 0',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Class Image */}
        <div class="support-img-frame" style={{ 
          width: '185px', 
          height: '148px', 
          borderRadius: '8px', 
          background: '#ccc', 
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Pilates class"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Class Details */}
        <div class="infoPanel-textContent" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          flex: 1,
          height: '100%',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111', 
              margin: '0 0 8px 0',
              lineHeight: '1.2'
            }}>
              1hr Semi Private Pilates Class
            </h3>
            <p class="infoCard-textBody" style={{ 
              fontSize: '14px', 
              color: '#666', 
              margin: '0',
              lineHeight: '1.4'
            }}>
              Choose between Mat, Reformer or both in a class no larger than 3 people.
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="#666"/>
              </svg>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                4 July, 2025
              </span>
            </div>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#111'
            }}>
              $30.00 AUD
            </span>
          </div>
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
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ width: '100%', padding: '8px 20px' }}>
            {/* First Name & Last Name Row */}
            <div className="field-row" style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem style={{ flex: 1 }}>
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>First Name</FormLabel>
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
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>Last Name</FormLabel>
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
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>Phone Number</FormLabel>
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
                    <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>Email Address</FormLabel>
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

            {/* Emergency Contact Section - Only show when main details are completed */}
            {mainDetailsCompleted && (
              <div 
                style={{ 
                  width: '100%',
                  animation: 'fadeInSlide 0.5s ease-in-out forwards',
                  opacity: 0,
                  transform: 'translateY(10px)'
                }}
                className="emergency-contact-reveal"
              >
                <div style={{ width: '100%', margin: '32px 0 16px 0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>Emergency Contact</h3>
                </div>

                {/* Emergency Contact Fields Row */}
                <div className="field-row" style={{ width: '100%', display: 'flex', gap: '16px' }}>
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem style={{ flex: 1 }}>
                        <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>Contact Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Emergency Contact Name" 
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
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem style={{ flex: 1 }}>
                        <FormLabel style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px', display: 'block', padding: '0 4px' }}>Phone Number</FormLabel>
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
              </div>
            )}
          </form>
        </Form>
      </div>
      {/* Navigation Button */}
      <div className="button-containerFull">
        <div 
          className="next-button-container" 
          style={{ 
            width: '100%', 
            margin: '24px 0 0 0', 
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
      </div>
    </>
  );
}
