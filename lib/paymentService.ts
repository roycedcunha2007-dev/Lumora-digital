/**
 * ============================================================================
 * LUMORA DIGITAL — Production-Quality Payment Abstraction Layer (Frontend Service)
 * ============================================================================
 * 
 * Provides a clean architecture ready for real payment gateway integration
 * (e.g. Stripe, Razorpay, LemonSqueezy) while running frontend demo simulations.
 * 
 * Rules:
 * - Never store raw card numbers, CVVs, or payment credentials in persistent storage.
 * - Clearly demarcate demo/sandbox transaction outcomes.
 * - Perform robust client-side validation for emails, phone numbers, and payment details.
 */

import { PlanItem } from "@/components/checkout/CheckoutContext";

export type PaymentMethod = "card" | "upi" | "gpay" | "paypal";

export interface CheckoutOrder {
  orderId: string;
  planId: string;
  planName: string;
  price: string;
  numericPrice: number;
  currency: string;
  quantity: number;
  subtotal: number;
  tax: number;
  total: number;
  cadence: string;
  features: string[];
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  company?: string;
  projectNotes?: string;
}

export interface CardPaymentData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface UpiPaymentData {
  upiId: string;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  order: CheckoutOrder;
  customer: CustomerDetails;
  paymentMethod: PaymentMethod;
  amountFormatted: string;
  timestamp: string;
  failureReason?: string;
  isDemo: true;
}

/**
 * Creates an immutable order summary object from the selected pricing plan.
 */
export function createCheckoutOrder(plan: PlanItem, quantity: number = 1): CheckoutOrder {
  const numericPrice = plan.numericPrice || 14999;
  const subtotal = numericPrice * Math.max(1, quantity);
  const tax = 0; // Waived for demo / transparent pricing
  const total = subtotal + tax;

  const orderId = `DEMO-LMR-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    orderId,
    planId: plan.id,
    planName: plan.name,
    price: plan.price,
    numericPrice,
    currency: "₹",
    quantity: Math.max(1, quantity),
    subtotal,
    tax,
    total,
    cadence: plan.cadence || "one-time",
    features: plan.features || [],
  };
}

/**
 * Validates customer details with strict email and phone formatting.
 */
export function validateCustomerDetails(details: CustomerDetails): Record<string, string> {
  const errors: Record<string, string> = {};

  // Full Name: Required, min 2 characters, letters & spaces
  if (!details.fullName || !details.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (details.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  // Email Validation: Strict RFC 5322 regex rejecting invalid formats
  const emailTrimmed = (details.email || "").trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailTrimmed) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(emailTrimmed)) {
    errors.email = "Enter a valid email address (e.g. name@example.com).";
  }

  // Phone Validation: 10-15 digits
  const phoneDigits = (details.phone || "").replace(/\D/g, "");
  if (!details.phone || !details.phone.trim()) {
    errors.phone = "Phone number is required for project coordination.";
  } else if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number (8–15 digits).";
  }

  return errors;
}

/**
 * Validates Card payment data.
 */
export function validateCardDetails(card: CardPaymentData): Record<string, string> {
  const errors: Record<string, string> = {};

  // Cardholder name
  if (!card.cardholderName || !card.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required.";
  } else if (card.cardholderName.trim().length < 3) {
    errors.cardholderName = "Enter the full name on your card.";
  }

  // Card number: 16 digits
  const digits = (card.cardNumber || "").replace(/\D/g, "");
  if (!digits) {
    errors.cardNumber = "Card number is required.";
  } else if (digits.length < 15 || digits.length > 19) {
    errors.cardNumber = "Enter a valid 16-digit card number.";
  }

  // Expiry MM/YY
  const expiry = (card.expiry || "").trim();
  if (!expiry) {
    errors.expiry = "Expiry date is required.";
  } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.expiry = "Use MM/YY format (e.g. 12/28).";
  } else {
    const [mmStr, yyStr] = expiry.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (mm < 1 || mm > 12) {
      errors.expiry = "Invalid month (01–12).";
    } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      errors.expiry = "Card has expired.";
    }
  }

  // CVV: 3 or 4 digits
  const cvv = (card.cvv || "").replace(/\D/g, "");
  if (!cvv) {
    errors.cvv = "CVV is required.";
  } else if (cvv.length < 3 || cvv.length > 4) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }

  return errors;
}

/**
 * Validates UPI payment data.
 */
export function validateUpiDetails(upi: UpiPaymentData): Record<string, string> {
  const errors: Record<string, string> = {};
  const upiId = (upi.upiId || "").trim();

  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  if (!upiId) {
    errors.upiId = "Please enter a valid UPI ID (e.g. yourname@bank).";
  } else if (!upiRegex.test(upiId)) {
    errors.upiId = "Invalid UPI ID format (example: yourname@okaxis).";
  }

  return errors;
}

/**
 * Simulates a robust frontend payment verification with simulated network latency,
 * zero credential leakage, and explicit failure simulation capabilities.
 */
export async function processDemoPayment(
  order: CheckoutOrder,
  customer: CustomerDetails,
  method: PaymentMethod,
  paymentData: any,
  options?: {
    forceFailure?: boolean;
    failureReason?: string;
    latencyMs?: number;
  }
): Promise<PaymentResult> {
  const latency = options?.latencyMs ?? 1400;

  // Simulate network roundtrip
  await new Promise((resolve) => setTimeout(resolve, latency));

  // Check for forced simulation failure or test decline card
  const isDeclineCard =
    method === "card" &&
    typeof paymentData?.cardNumber === "string" &&
    paymentData.cardNumber.replace(/\s/g, "").endsWith("0002");

  if (options?.forceFailure || isDeclineCard) {
    const reason =
      options?.failureReason ||
      (isDeclineCard
        ? "Simulated Test Card Decline: Transaction was declined by the issuer sandbox."
        : "Sandbox Authorization Declined: Unable to verify simulated funds.");

    return {
      success: false,
      orderId: order.orderId,
      order,
      customer,
      paymentMethod: method,
      amountFormatted: `${order.currency}${order.total.toLocaleString("en-IN")}`,
      timestamp: new Date().toISOString(),
      failureReason: reason,
      isDemo: true,
    };
  }

  // Successful demo completion
  return {
    success: true,
    orderId: order.orderId,
    order,
    customer,
    paymentMethod: method,
    amountFormatted: `${order.currency}${order.total.toLocaleString("en-IN")}`,
    timestamp: new Date().toISOString(),
    isDemo: true,
  };
}

/**
 * Formats the downloadable receipt text for the client.
 */
export function generateReceiptText(result: PaymentResult): string {
  return `================================================================
LUMORA DIGITAL — FRONTEND DEMO PAYMENT RECEIPT
================================================================
Notice: This is a verified frontend simulation.
No actual money or funds were deducted from your account.
----------------------------------------------------------------
Order Reference : ${result.orderId}
Transaction Date: ${new Date(result.timestamp).toLocaleString()}
Status          : SUCCESS (DEMO SANDBOX)
Payment Channel : ${result.paymentMethod.toUpperCase()}
----------------------------------------------------------------
CUSTOMER DETAILS:
Name            : ${result.customer.fullName}
Email           : ${result.customer.email}
Phone           : ${result.customer.countryCode} ${result.customer.phone}
Company         : ${result.customer.company || "Individual Client"}
----------------------------------------------------------------
PACKAGE BREAKDOWN:
Plan Selected   : ${result.order.planName} Package
Quantity        : ${result.order.quantity}
Cadence         : ${result.order.cadence}
Subtotal        : ${result.order.currency}${result.order.subtotal.toLocaleString("en-IN")}
Platform Fee    : ₹0.00 (Demo Waived)
Taxes (GST 18%) : ₹0.00 (Included/Waived)
----------------------------------------------------------------
TOTAL DUE / PAID: ${result.amountFormatted} (DEMO)
================================================================
DELIVERABLES INCLUDED:
${result.order.features.map((f, i) => `[${i + 1}] ${f}`).join("\n")}
================================================================
Support & Inquiries: business@lumoradigital.com
Lumora Digital Studio · Engineered for Performance & Impact.
================================================================`;
}

export const paymentService = {
  createCheckoutOrder,
  validateCustomerDetails,
  validateCardDetails,
  validateUpiDetails,
  processDemoPayment,
  generateReceiptText,
};
