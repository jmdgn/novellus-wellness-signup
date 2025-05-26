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
    <div className="form-inner">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Reserve your spot</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Reserve your spot today for our introductory Pilates class and start your journey to wellness!
        </p>
      </div>

      {/* Class Info */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <div className="font-semibold text-slate-800">Introduction Pilates Session | 1hr Class</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-800">$20.00 AUD</div>
        </div>
      </div>

      {/* Contact Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Cooper" 
                      className="form-field"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Phone Number</FormLabel>
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="jane.cooper@email.com" 
                    className="form-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <div className="step-indicator">Step 1 of 4</div>
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
