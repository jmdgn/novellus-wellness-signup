import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  timePreferences: jsonb("time_preferences").notNull(), // Array of time slots in priority order
  language: text("language").notNull().default("english"),
  painAreas: jsonb("pain_areas"), // Array of selected pain areas
  isPregnant: boolean("is_pregnant").default(false),
  pregnancyWeeks: integer("pregnancy_weeks"),
  heartCondition: boolean("heart_condition").default(false),
  chestPain: boolean("chest_pain").default(false),
  dizziness: boolean("dizziness").default(false),
  asthmaAttack: boolean("asthma_attack").default(false),
  diabetesControl: boolean("diabetes_control").default(false),
  otherConditions: boolean("other_conditions").default(false),
  medicalConditions: text("medical_conditions"),
  hasMedicalConditions: boolean("has_medical_conditions").default(false),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
  totalAmount: integer("total_amount").notNull().default(3000), // in cents (AUD)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  stripePaymentIntentId: true,
  paymentStatus: true,
});

export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required").refine((phone) => {
    // Remove all non-digit characters for validation
    const cleaned = phone.replace(/\D/g, '');
    // Accept formats: 04xxxxxxxx, +614xxxxxxxx, or 614xxxxxxxx
    return /^(0[2-9]\d{8}|614\d{8}|\+614\d{8})$/.test(cleaned) || /^04\d{8}$/.test(cleaned);
  }, "Please enter a valid Australian phone number (e.g., 0412 345 678)"),
  email: z.string().email("Please enter a valid email address"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required").refine((phone) => {
    const cleaned = phone.replace(/\D/g, '');
    // Accept formats: 04xxxxxxxx, +614xxxxxxxx, or 614xxxxxxxx
    return /^(0[2-9]\d{8}|614\d{8}|\+614\d{8})$/.test(cleaned) || /^04\d{8}$/.test(cleaned);
  }, "Please enter a valid Australian phone number (e.g., 0412 345 678)"),
  language: z.enum(["english", "spanish"])
});

export const timePreferencesSchema = z.object({
  selectedDate: z.string().optional(),
  timePreferences: z.array(z.string()).min(1, "Please select at least one time preference").max(3, "You can select up to 3 time preferences"),
  classType: z.enum(["semi-private", "private"]).default("semi-private"),
  language: z.enum(["english", "spanish"]).default("english"),
});

export const medicalDeclarationSchema = z.object({
  painAreas: z.array(z.enum(["neck", "shoulders", "back", "hips", "knees", "ankles", "other", "none"])).optional(),
  isPregnant: z.boolean(),
  pregnancyWeeks: z.number().optional(),
  heartCondition: z.boolean(),
  chestPain: z.boolean(),
  dizziness: z.boolean(),
  asthmaAttack: z.boolean(),
  diabetesControl: z.boolean(),
  otherConditions: z.boolean(),
  medicalConditions: z.string().optional(),
  hasMedicalConditions: z.boolean().default(false),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type TimePreferences = z.infer<typeof timePreferencesSchema>;
export type MedicalDeclaration = z.infer<typeof medicalDeclarationSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
