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
  timePreferences: jsonb("time_preferences").notNull(), // Array of time slots in priority order
  language: text("language").notNull().default("english"),
  painAreas: jsonb("pain_areas"), // Array of selected pain areas
  isPregnant: boolean("is_pregnant").default(false),
  medicalConditions: text("medical_conditions"),
  hasMedicalConditions: boolean("has_medical_conditions").default(false),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
  totalAmount: integer("total_amount").notNull().default(2000), // in cents (AUD)
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
  phoneNumber: z.string().regex(/^(\+61|0)[2-9]\d{8}$/, "Please enter a valid Australian phone number"),
  email: z.string().email("Please enter a valid email address"),
});

export const timePreferencesSchema = z.object({
  timePreferences: z.array(z.enum(["morning", "afternoon", "evening"])).min(1, "Please select at least one time preference").max(3, "You can select up to 3 time preferences"),
  language: z.enum(["english", "spanish"]).default("english"),
});

export const medicalDeclarationSchema = z.object({
  painAreas: z.array(z.enum(["neck", "shoulders", "back", "hips", "knees", "ankles", "other"])).optional(),
  isPregnant: z.boolean().default(false),
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
