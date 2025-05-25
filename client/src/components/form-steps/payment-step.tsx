import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentStepProps {
  formData: any;
  onPrevious: () => void;
  submitBooking: (data: any) => Promise<any>;
  isSubmitting: boolean;
}

const CheckoutForm = ({ formData, onPrevious, submitBooking, isSubmitting }: PaymentStepProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // First create the booking
      const booking = await submitBooking({
        ...formData.contact,
        ...formData.timePreferences,
        ...formData.medical,
        totalAmount: 2000, // $20 AUD in cents
      });

      // Create payment intent
      const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        bookingId: booking.id,
      });
      const { paymentIntentId } = await paymentResponse.json();

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success/${booking.id}`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Confirm payment on the backend
        await apiRequest("POST", "/api/confirm-payment", {
          bookingId: booking.id,
          paymentIntentId,
        });

        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });

        // Redirect to success page
        setLocation(`/success/${booking.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment & Confirmation</h1>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-800">$20.00 AUD</div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <PaymentElement />
        </div>

        {/* Terms and Conditions */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-xs text-slate-600 leading-relaxed">
            I agree that the information I have given on this document is true and correct. I have read and understood all wording written in this document. I take full responsibility for my actions at any and all times on site, off site and on-line. This includes during any workouts, classes, practices and use of equipment whilst engaged in activities.
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          type="submit"
          disabled={!stripe || isProcessing || isSubmitting}
          className="w-full bg-slate-800 hover:bg-slate-900 py-4 px-6"
        >
          {isProcessing ? "Processing..." : "Confirm reservation"}
        </Button>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrevious}
            disabled={isProcessing}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="step-indicator">Step 4 of 4</div>
        </div>
      </form>
    </div>
  );
};

export default function PaymentStep(props: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Create a temporary booking to get payment intent
    const initializePayment = async () => {
      try {
        // First create the booking
        const booking = await props.submitBooking({
          ...props.formData.contact,
          ...props.formData.timePreferences,
          ...props.formData.medical,
          totalAmount: 2000,
        });

        // Then create payment intent
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          bookingId: booking.id,
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        });
      }
    };

    if (props.formData.contact && props.formData.timePreferences) {
      initializePayment();
    }
  }, []);

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Preparing payment...</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0ea5e9',
            borderRadius: '8px',
          }
        }
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
}
