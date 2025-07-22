import { users, type User, type InsertUser, bookings, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  updateBookingPayment(id: number, paymentIntentId: string, status: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async updateBookingPayment(id: number, paymentIntentId: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({
        stripePaymentIntentId: paymentIntentId,
        paymentStatus: status
      })
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookings: Map<number, Booking>;
  private currentUserId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.currentUserId = 1;
    this.currentBookingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id,
      language: insertBooking.language || "english",
      painAreas: insertBooking.painAreas || null,
      medicalConditions: insertBooking.medicalConditions || null,
      isPregnant: insertBooking.isPregnant || false,
      hasMedicalConditions: insertBooking.hasMedicalConditions || false,
      pregnancyWeeks: insertBooking.pregnancyWeeks ?? null,
      heartCondition: insertBooking.heartCondition ?? false,
      chestPain: insertBooking.chestPain ?? false,
      dizziness: insertBooking.dizziness ?? false,
      asthmaAttack: insertBooking.asthmaAttack ?? false,
      diabetesControl: insertBooking.diabetesControl ?? false,
      otherConditions: insertBooking.otherConditions ?? false,
      emergencyContactName: insertBooking.emergencyContactName ?? null,
      emergencyContactPhone: insertBooking.emergencyContactPhone ?? null,
      totalAmount: insertBooking.totalAmount || 3000,
      createdAt: new Date(),
      stripePaymentIntentId: null,
      paymentStatus: "pending"
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingPayment(id: number, paymentIntentId: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      const updatedBooking = {
        ...booking,
        stripePaymentIntentId: paymentIntentId,
        paymentStatus: status
      };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
}

export const storage = new DatabaseStorage();
