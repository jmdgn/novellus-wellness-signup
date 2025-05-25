import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContactInfo, TimePreferences, MedicalDeclaration } from "@shared/schema";

interface BookingFormData {
  contact: Partial<ContactInfo>;
  timePreferences: Partial<TimePreferences>;
  medical: Partial<MedicalDeclaration>;
}

export function useBookingForm() {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<BookingFormData>({
    contact: {},
    timePreferences: { language: "english" },
    medical: { hasMedicalConditions: false, isPregnant: false },
  });

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const submitBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/booking", bookingData);
      return response.json();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const submitBooking = async (data: any) => {
    try {
      return await submitBookingMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  // Validation functions for each step
  const validateContactInfo = async (data: ContactInfo) => {
    try {
      const response = await apiRequest("POST", "/api/validate/contact", data);
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Validation failed");
    }
  };

  const validateTimePreferences = async (data: TimePreferences) => {
    try {
      const response = await apiRequest("POST", "/api/validate/time-preferences", data);
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Validation failed");
    }
  };

  const validateMedicalDeclaration = async (data: MedicalDeclaration) => {
    try {
      const response = await apiRequest("POST", "/api/validate/medical", data);
      return response.json();
    } catch (error: any) {
      throw new Error(error.message || "Validation failed");
    }
  };

  // Check if form is ready for final step
  const isFormComplete = () => {
    return (
      formData.contact.firstName &&
      formData.contact.lastName &&
      formData.contact.email &&
      formData.contact.phoneNumber &&
      formData.timePreferences.timePreferences &&
      formData.timePreferences.timePreferences.length > 0 &&
      formData.timePreferences.language
    );
  };

  return {
    formData,
    updateFormData,
    submitBooking,
    isSubmitting: submitBookingMutation.isPending,
    validateContactInfo,
    validateTimePreferences,
    validateMedicalDeclaration,
    isFormComplete,
  };
}
