import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cancellationPolicyAccepted, setCancellationPolicyAccepted] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!cancellationPolicyAccepted) {
      toast({
        title: "Cancellation Policy Required",
        description: "Please accept the cancellation policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First create the booking
      const booking = await submitBooking({
        ...formData.contact,
        ...formData.timePreferences,
        ...formData.medical,
        totalAmount: 3000, // $30 AUD in cents
      });

      // Create payment intent
      const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        bookingId: booking.id,
      });
      const { paymentIntentId } = await paymentResponse.json();

      // Confirm payment with the payment method from the form
      const { error, paymentIntent } = await stripe.confirmPayment({
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
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on the backend
        await apiRequest("POST", "/api/confirm-payment", {
          bookingId: booking.id,
          paymentIntentId: paymentIntent.id,
        });

        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });

        // Redirect to success page
        setLocation(`/success/${booking.id}`);
      } else {
        toast({
          title: "Payment Processing",
          description: "Payment is being processed...",
          variant: "default",
        });
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

  // Check if form is valid (Stripe elements loaded, ready, and terms accepted)
  const isFormValid = stripe && elements && termsAccepted;

  return (
    <>
      {/* Title Group */}
      <div style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', margin: '0', lineHeight: '1.6' }}>
            Payment & Confirmation
          </h1>
        </div>
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#666', margin: '0', lineHeight: '1.4' }}>
            $30.00 AUD
          </h2>
        </div>
      </div>

      {/* Form Inner Container */}
      <div className="form-inner" style={{ width: '100%', margin: '24px 0 0 0' }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', padding: '16px 20px' }} className="space-y-6">
        <div className="rounded-lg p-4">
          <PaymentElement />
        </div>

        {/* Terms and Conditions */}
        <div className="rounded-lg p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              className="mt-1 checkbox-custom"
              style={{ width: '24px', height: '24px', borderRadius: '6px' }}
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              I agree that the information I have given on this document is true and correct. I have read and understood all wording written in this document. I take full responsibility for my actions at any and all times on site, off site and on-line. This includes during any workouts, classes, practices and use of equipment whilst engaged in activities.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox 
              id="cancellation"
              checked={cancellationPolicyAccepted}
              onCheckedChange={(checked) => setCancellationPolicyAccepted(checked === true)}
              className="mt-1 checkbox-custom"
              style={{ width: '24px', height: '24px', borderRadius: '6px' }}
            />
            <label htmlFor="cancellation" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              I have read and agree to the{' '}
              <button
                type="button"
                onClick={() => setShowCancellationPolicy(true)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                cancellation policy
              </button>
              . I understand that cancellations made within 24 hours of the class will result in forfeiture of payment.
            </label>
          </div>
        </div>

        </form>
      </div>

      {/* Navigation Container */}
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
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'background-color 0.2s ease',
            opacity: isProcessing ? 0.5 : 1
          }}
          onClick={isProcessing ? undefined : onPrevious}
          onMouseEnter={(e) => {
            if (!isProcessing) e.currentTarget.style.background = '#F9F9F9';
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) e.currentTarget.style.background = '#fff';
          }}
        >
          <ChevronLeft size={16} color="#111" />
        </div>

        {/* Confirm Button */}
        <div 
          className="next-button-container" 
          style={{ 
            flex: 1,
            cursor: (!stripe || isProcessing || isSubmitting) ? 'not-allowed' : 'pointer',
            border: (stripe && !isProcessing && !isSubmitting) ? '1px solid #111111' : '1px solid #111',
            background: (stripe && !isProcessing && !isSubmitting) ? '#111111' : '#fff',
            color: (stripe && !isProcessing && !isSubmitting) ? '#FFF' : '#111',
            opacity: (!stripe || isProcessing || isSubmitting) ? 0.5 : 1
          }}
          onClick={(!stripe || isProcessing || isSubmitting) ? undefined : (e) => {
            e.preventDefault();
            const form = document.querySelector('form');
            if (form) {
              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
              form.dispatchEvent(submitEvent);
            }
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <div className="step-text" style={{ color: 'inherit' }}>Step 4 of 4</div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <div className="action-text" style={{ color: 'inherit' }}>
              {isProcessing ? "Processing..." : "Confirm reservation"}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy Dialog */}
      <Dialog open={showCancellationPolicy} onOpenChange={setShowCancellationPolicy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancellation Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              We understand that plans can change. To receive a full refund of your booking fee ($30.00 AUD), please ensure you cancel at least 24 hours before your scheduled class.
            </p>
            <p>
              Cancellations made within 24 hours of the class start time will forfeit the full payment. No refunds will be issued for late cancellations or no-shows.
            </p>
            <p>
              If you're unable to attend due to a medical emergency, please get in touch — we're happy to review these on a case-by-case basis.
            </p>
            <p className="font-medium">
              Thank you for your understanding and cooperation.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
          totalAmount: 3000,
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
            colorPrimary: '#0095F6',
            borderRadius: '8px',
          }
        }
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  );
}
