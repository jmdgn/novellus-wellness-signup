import { z } from "zod";

// Australian phone number validation
export const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^(\+61|0)[2-9]\d{8}$/,
    "Please enter a valid Australian phone number (e.g., 0412 345 678 or +61412345678)"
  );

// Email validation
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// Name validation
export const nameSchema = z
  .string()
  .min(1, "This field is required")
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be less than 50 characters");

// Time preferences validation
export const timePreferencesValidation = z
  .array(z.enum(["morning", "afternoon", "evening"]))
  .min(1, "Please select at least one time preference")
  .max(3, "You can select up to 3 time preferences");

// Medical conditions validation
export const medicalConditionsSchema = z.object({
  painAreas: z
    .array(z.enum(["neck", "shoulders", "back", "hips", "knees", "ankles", "other"]))
    .optional()
    .default([]),
  isPregnant: z.boolean().default(false),
  medicalConditions: z.string().optional(),
  hasMedicalConditions: z.boolean().default(false),
});

// Format Australian phone number for display
export const formatAustralianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('61')) {
    // International format +61
    return '+' + cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    // Local format 0x xxxx xxxx
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone; // Return as-is if doesn't match expected patterns
};

// Validate step data
export const validateStepData = (step: number, data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!data.firstName?.trim()) errors.push("First name is required");
      if (!data.lastName?.trim()) errors.push("Last name is required");
      if (!data.email?.trim()) errors.push("Email is required");
      if (!data.phoneNumber?.trim()) errors.push("Phone number is required");
      
      if (data.email && !emailSchema.safeParse(data.email).success) {
        errors.push("Please enter a valid email address");
      }
      
      if (data.phoneNumber && !phoneNumberSchema.safeParse(data.phoneNumber).success) {
        errors.push("Please enter a valid Australian phone number");
      }
      break;

    case 2:
      if (!data.timePreferences?.length) {
        errors.push("Please select at least one time preference");
      }
      if (data.timePreferences?.length > 3) {
        errors.push("You can select up to 3 time preferences");
      }
      if (!data.language) {
        errors.push("Please select a language preference");
      }
      break;

    case 3:
      // Medical step is largely optional, just validate format if provided
      if (data.medicalConditions && typeof data.medicalConditions !== 'string') {
        errors.push("Medical conditions must be text");
      }
      break;

    case 4:
      // Payment validation would be handled by Stripe
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
