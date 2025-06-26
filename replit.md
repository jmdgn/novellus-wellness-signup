# Replit.md

## Overview

This is a full-stack web application for a Pilates booking system called "Novellus Wellness". The application provides a multi-step booking form that collects contact information, time preferences, medical declarations, and handles payment processing through Stripe. The system is built with a React frontend using TypeScript and Vite, paired with a Node.js Express backend that connects to a PostgreSQL database via Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript (tsx for development)
- **Framework**: Express.js with middleware for JSON parsing and logging
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Stripe for payment processing
- **Email Service**: Brevo (formerly SendinBlue) with fallback to SendGrid
- **SMS Service**: Twilio integration

### Payment Processing
- **Provider**: Stripe with client-side Elements integration
- **Flow**: Payment Intent creation on backend, client-side confirmation
- **Security**: Server-side validation and webhook handling

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Bookings Table**: Comprehensive booking data including:
  - Personal information (name, phone, email, emergency contacts)
  - Time preferences stored as JSON array
  - Medical conditions and declarations
  - Stripe payment tracking
  - Audit fields (created_at, payment_status)

### Form Steps
1. **Contact Information**: Personal details and emergency contact
2. **Time Preferences**: Available time slots with priority ordering
3. **Medical Declaration**: Health questionnaire and pain area selection
4. **Payment**: Stripe integration with terms acceptance

### Communication Services
- **Email**: Brevo API for transactional emails with SendGrid fallback
- **SMS**: Twilio for booking confirmations and notifications
- **Error Handling**: Comprehensive logging and graceful degradation

## Data Flow

1. **Form Submission**: Multi-step form data is collected and validated client-side
2. **Booking Creation**: Complete form data is sent to `/api/booking` endpoint
3. **Database Storage**: Booking record is created with pending payment status
4. **Payment Processing**: Stripe Payment Intent is created and returned to client
5. **Payment Confirmation**: Client confirms payment using Stripe Elements
6. **Status Update**: Payment status is updated in database upon confirmation
7. **Notifications**: Email and SMS confirmations are sent to customer

## External Dependencies

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (client-side)
- `BREVO_API_KEY`: Brevo email service API key
- `SENDGRID_API_KEY`: SendGrid fallback email service
- `TWILIO_ACCOUNT_SID`: Twilio SMS service
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio sending phone number

### Third-Party Services
- **Neon Database**: PostgreSQL hosting
- **Stripe**: Payment processing and webhooks
- **Brevo**: Primary email service
- **SendGrid**: Backup email service
- **Twilio**: SMS notifications

### Development Tools
- **Replit**: Development environment with built-in PostgreSQL
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development
- **Environment**: Replit with hot reload
- **Database**: Local PostgreSQL instance
- **Build**: Vite dev server with Express backend
- **Port**: Application runs on port 5000

### Production
- **Build Process**: 
  1. Vite builds client to `dist/public`
  2. ESBuild bundles server to `dist/index.js`
- **Deployment**: Replit autoscale deployment
- **Static Files**: Served from `dist/public` directory
- **Environment**: Production environment variables required

### Database Management
- **Migrations**: Drizzle Kit handles schema changes
- **Deployment**: `npm run db:push` applies schema to database
- **Connection**: SSL enabled for production PostgreSQL connections

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.