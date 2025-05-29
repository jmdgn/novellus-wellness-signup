import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertBookingSchema, contactInfoSchema, timePreferencesSchema, medicalDeclarationSchema } from "@shared/schema";
import { sendEmail } from "./brevo";
import { sendSMS } from "./twilio";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create booking (steps 1-3)
  app.post("/api/booking", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      
      // Send medical clearance email if needed
      const needsMedicalClearance = booking.isPregnant || 
        booking.heartCondition || 
        booking.chestPain || 
        booking.dizziness || 
        booking.asthmaAttack || 
        booking.diabetesControl || 
        booking.otherConditions ||
        (booking.painAreas && Array.isArray(booking.painAreas) && booking.painAreas.length > 0 && !booking.painAreas.includes("none"));
        
      if (needsMedicalClearance) {
        await sendMedicalClearanceEmail(booking);
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: "Validation error: " + error.message });
    }
  });

  // Create payment intent for step 4
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { bookingId } = req.body;
      
      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalAmount, // $20 AUD in cents
        currency: "aud",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          bookingId: bookingId.toString(),
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment and complete booking
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { bookingId, paymentIntentId } = req.body;
      
      if (!bookingId || !paymentIntentId) {
        return res.status(400).json({ message: "Booking ID and Payment Intent ID are required" });
      }

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Accept both 'succeeded' and 'requires_capture' as successful payments in test mode
      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
        // Update booking status
        const updatedBooking = await storage.updateBookingPayment(bookingId, paymentIntentId, "completed");
        
        if (updatedBooking) {
          // Send confirmation email and SMS
          await sendConfirmationEmail(updatedBooking);
          await sendConfirmationSMS(updatedBooking);
          
          // Add medical clearance flag for frontend display
          const needsMedicalClearance = updatedBooking.isPregnant || 
            updatedBooking.heartCondition || 
            updatedBooking.chestPain || 
            updatedBooking.dizziness || 
            updatedBooking.asthmaAttack || 
            updatedBooking.diabetesControl || 
            updatedBooking.otherConditions ||
            (updatedBooking.painAreas && Array.isArray(updatedBooking.painAreas) && updatedBooking.painAreas.length > 0 && !updatedBooking.painAreas.includes("none"));
          
          res.json({ 
            success: true, 
            booking: { ...updatedBooking, needsMedicalClearance }
          });
        } else {
          res.status(404).json({ message: "Booking not found" });
        }
      } else {
        await storage.updateBookingPayment(bookingId, paymentIntentId, "failed");
        res.status(400).json({ 
          message: `Payment not successful. Status: ${paymentIntent.status}` 
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Get booking details
  app.get("/api/booking/:id", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Add medical clearance flag for frontend display
      const needsMedicalClearance = booking.isPregnant || 
        booking.heartCondition || 
        booking.chestPain || 
        booking.dizziness || 
        booking.asthmaAttack || 
        booking.diabetesControl || 
        booking.otherConditions ||
        (booking.painAreas && Array.isArray(booking.painAreas) && booking.painAreas.length > 0 && !booking.painAreas.includes("none"));
      
      res.json({ ...booking, needsMedicalClearance });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching booking: " + error.message });
    }
  });

  // Validate form steps
  app.post("/api/validate/contact", async (req, res) => {
    try {
      const validatedData = contactInfoSchema.parse(req.body);
      res.json({ valid: true, data: validatedData });
    } catch (error: any) {
      res.status(400).json({ valid: false, errors: error.errors });
    }
  });

  app.post("/api/validate/time-preferences", async (req, res) => {
    try {
      const validatedData = timePreferencesSchema.parse(req.body);
      res.json({ valid: true, data: validatedData });
    } catch (error: any) {
      res.status(400).json({ valid: false, errors: error.errors });
    }
  });

  app.post("/api/validate/medical", async (req, res) => {
    try {
      const validatedData = medicalDeclarationSchema.parse(req.body);
      res.json({ valid: true, data: validatedData });
    } catch (error: any) {
      res.status(400).json({ valid: false, errors: error.errors });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function sendConfirmationEmail(booking: any) {
  console.log(`=== CONFIRMATION EMAIL DEBUG ===`);
  console.log(`Booking ID: ${booking.id}`);
  console.log(`Recipient: ${booking.email}`);
  console.log(`Name: ${booking.firstName} ${booking.lastName}`);
  
  if (!process.env.BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not configured, skipping confirmation email");
    return;
  }

  const timeSlotNames = {
    morning: "Morning (7:00 AM - 11:00 AM)",
    afternoon: "Afternoon (1:00 PM - 3:00 PM)", 
    evening: "Evening (5:00 PM - 7:00 PM)"
  };

  const preferredTimes = (booking.timePreferences as string[])
    .map((slot, index) => `${index + 1}. ${timeSlotNames[slot as keyof typeof timeSlotNames] || slot}`)
    .join('\n');

  const emailContent = `
    <h2>Booking Confirmation - Introduction Pilates Session</h2>
    
    <p>Dear ${booking.firstName} ${booking.lastName},</p>
    
    <p>Thank you for booking your Introduction Pilates Session! We're excited to welcome you to our studio.</p>
    
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Class:</strong> Introduction Pilates Session (1 hour)</li>
      <li><strong>Amount Paid:</strong> $30.00 AUD</li>
      <li><strong>Language:</strong> ${booking.language === 'english' ? 'English' : 'Español'}</li>
      <li><strong>Contact:</strong> ${booking.email}</li>
      <li><strong>Phone:</strong> ${booking.phoneNumber}</li>
    </ul>
    
    <h3>Your Time Preferences (in order of priority):</h3>
    <pre>${preferredTimes}</pre>
    
    <p>We will contact you within 24 hours to confirm your exact class time based on your preferences and availability.</p>
    
    <p>What to bring:</p>
    <ul>
      <li>Comfortable workout clothing</li>
      <li>Water bottle</li>
      <li>Towel</li>
      <li>Positive attitude!</li>
    </ul>
    
    <p>If you have any questions, please don't hesitate to contact us.</p>
    
    <p>We look forward to seeing you at the studio!</p>
    
    <p>Best regards,<br/>
    The Pirouette Team</p>
  `;

  try {
    console.log(`Sending confirmation email...`);
    console.log(`Subject: Booking Confirmation - Your Introduction Pilates Session`);
    console.log(`From: noreply@novellus.net.au`);
    console.log(`Email content length: ${emailContent.length} characters`);
    
    const result = await sendEmail(process.env.BREVO_API_KEY!, {
      to: booking.email,
      from: 'noreply@novellus.net.au',
      subject: 'Booking Confirmation - Your Introduction Pilates Session',
      html: emailContent
    });
    
    if (result) {
      console.log("✅ Confirmation email sent successfully to:", booking.email);
    } else {
      console.log("❌ Confirmation email failed to send to:", booking.email);
    }
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
  }
  console.log(`=== END CONFIRMATION EMAIL DEBUG ===`)
}

async function sendMedicalClearanceEmail(booking: any) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not configured, skipping medical clearance email");
    return;
  }

  const emailContent = `
    <h2>Medical Clearance Required</h2>
    
    <p>Dear ${booking.firstName} ${booking.lastName},</p>
    
    <p>Thank you for booking your Introduction Pilates Session. As you indicated some medical conditions or concerns on your booking form, we require medical clearance from your doctor before you can participate in classes.</p>
    
    <h3>What you need to do:</h3>
    <ol>
      <li>Please consult with your doctor or healthcare provider</li>
      <li>Obtain written clearance for participating in pilates exercises</li>
      <li>Email us the clearance document or have your doctor contact us directly</li>
    </ol>
    
    <h3>Medical Information Provided:</h3>
    ${booking.painAreas && booking.painAreas.length > 0 ? `
    <p><strong>Pain Areas:</strong> ${(booking.painAreas as string[]).join(', ')}</p>
    ` : ''}
    ${booking.isPregnant ? '<p><strong>Pregnancy:</strong> Yes</p>' : ''}
    ${booking.medicalConditions ? `
    <p><strong>Additional Information:</strong><br/>
    ${booking.medicalConditions}</p>
    ` : ''}
    
    <p>Once we receive your medical clearance, we will confirm your class time and you'll be all set to start your pilates journey!</p>
    
    <p>If you have any questions about this process, please contact us at your convenience.</p>
    
    <p>Best regards,<br/>
    The Pirouette Team</p>
  `;

  try {
    await sendEmail(process.env.BREVO_API_KEY!, {
      to: booking.email,
      from: 'noreply@novellus.net.au',
      subject: 'Medical Clearance Required - Novellus Pilates',
      html: emailContent
    });
    console.log("Medical clearance email sent successfully to:", booking.email);
  } catch (error) {
    console.error("Failed to send medical clearance email:", error);
  }
}

async function sendConfirmationSMS(booking: any) {
  console.log("Starting SMS confirmation for booking:", booking.id);
  console.log("Phone number from booking:", booking.phoneNumber);
  
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("Twilio credentials not configured, skipping SMS confirmation");
    return;
  }

  const timeSlotNames = {
    morning: "Morning (7-11AM)",
    afternoon: "Afternoon (1-3PM)", 
    evening: "Evening (5-7PM)"
  };

  const preferredTimes = (booking.timePreferences as string[])
    .map((slot, index) => `${index + 1}. ${timeSlotNames[slot as keyof typeof timeSlotNames] || slot}`)
    .join(', ');

  const smsMessage = `🧘‍♀️ Booking Confirmed! Hi ${booking.firstName}, your Introduction Pilates Session is booked for $20 AUD. Your time preferences: ${preferredTimes}. We'll contact you within 24hrs to confirm your exact time. Check your email for full details. - Novellus Pilates`;

  // Format phone number for international format (Australia)
  let formattedPhone = booking.phoneNumber.replace(/\s+/g, ''); // Remove spaces
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '+61' + formattedPhone.substring(1); // Convert 04xx to +614xx
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+61' + formattedPhone; // Add +61 if no country code
  }
  
  console.log("Formatted phone number:", formattedPhone);

  try {
    await sendSMS({
      to: formattedPhone,
      message: smsMessage
    });
    console.log("Confirmation SMS sent successfully to:", booking.phoneNumber);
  } catch (error) {
    console.error("Failed to send confirmation SMS:", error);
  }
}
