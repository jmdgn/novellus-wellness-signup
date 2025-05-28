import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Success() {
  const { bookingId } = useParams();
  const [, setLocation] = useLocation();

  const { data: booking, isLoading } = useQuery({
    queryKey: [`/api/booking/${bookingId}`],
    enabled: !!bookingId
  });

  const timeSlotNames = {
    morning: "Morning (7:00 AM - 11:00 AM)",
    afternoon: "Afternoon (1:00 PM - 3:00 PM)", 
    evening: "Evening (5:00 PM - 7:00 PM)"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ocean-gradient">
        <Card className="form-card p-8">
          <CardContent className="text-center p-0">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ocean-gradient">
        <Card className="form-card p-8">
          <CardContent className="text-center p-0">
            <p className="text-destructive">Booking not found</p>
            <Button 
              className="mt-4" 
              onClick={() => setLocation("/")}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ocean-gradient">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'cursive' }}>
          Pirouette
        </div>
      </div>

      <div className="w-full max-w-lg">
        <Card className="form-card p-8">
          <CardContent className="text-center p-0">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h1>
            <p className="text-slate-600 text-sm mb-6">
              Thank you for booking your Introduction Pilates Session. We've sent a confirmation email with all the details.
            </p>
            
            {/* Booking Summary */}
            <div className="rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Class:</span>
                <span className="font-medium">Introduction Pilates Session</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Duration:</span>
                <span className="font-medium">1 hour</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Amount Paid:</span>
                <span className="font-medium">$30.00 AUD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Contact:</span>
                <span className="font-medium">{booking.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Language:</span>
                <span className="font-medium">{booking.language === 'english' ? 'English' : 'Español'}</span>
              </div>
              {booking.timePreferences && Array.isArray(booking.timePreferences) && booking.timePreferences.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-600 text-sm">Time Preferences:</span>
                  <div className="mt-1 space-y-1">
                    {booking.timePreferences.map((slot: string, index: number) => (
                      <div key={slot} className="text-sm">
                        <span className="font-medium">{index + 1}.</span> {timeSlotNames[slot as keyof typeof timeSlotNames] || slot}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {booking.needsMedicalClearance && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Medical Clearance Required:</strong> We've sent you a separate email with instructions for obtaining medical clearance from your doctor.
                </p>
              </div>
            )}

            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={() => setLocation("/")}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
