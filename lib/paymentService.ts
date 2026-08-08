/**
 * ============================================================================
 * LUMORA DIGITAL — Strict Realistic Test/Demo Payment Abstraction Layer
 * ============================================================================
 * 
 * Rules:
 * - Never store raw card numbers, CVVs, or payment credentials in persistent storage.
 * - Enforce strict client-side validation for Card, CVV (exactly 3 digits), Expiry (MM/YY 01-12),
 *   Email (strict RFC), Phone (10 digits), and Name.
 * - Clearly mark all transactions and receipts as TEST / DEMO sandbox operations.
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
  const tax = 0; // Transparent zero-hidden-fee pricing
  const total = subtotal + tax;

  const orderId = `DEMO-${Math.floor(10000000 + Math.random() * 90000000)}`;

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

  // Full Name: Required, min 3 characters, letters and spaces only
  const trimmedName = (details.fullName || "").trim();
  if (!trimmedName) {
    errors.fullName = "Full name is required.";
  } else if (trimmedName.length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  } else if (/\d/.test(trimmedName)) {
    errors.fullName = "Name cannot contain numbers.";
  }

  // Email Validation: Strict RFC regex requiring username + @ + domain + dot + TLD (2+ chars)
  // Rejects name@, name.com, name@gmail, @gmail.com
  const emailTrimmed = (details.email || "").trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailTrimmed) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(emailTrimmed)) {
    errors.email = "Enter a valid email address (e.g. customer@gmail.com).";
  }

  // Phone Validation: 10 digits (digits only)
  const phoneDigits = (details.phone || "").replace(/\D/g, "");
  if (!details.phone || !details.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (phoneDigits.length !== 10) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }

  return errors;
}

/**
 * Validates Card payment data with strict rules:
 * - Card number: Exactly 16 digits
 * - CVV: Exactly 3 digits (masked)
 * - Expiry: MM/YY (Month 01-12, unexpired)
 * - Cardholder name: Required, letters only
 */
export function validateCardDetails(card: CardPaymentData): Record<string, string> {
  const errors: Record<string, string> = {};

  // Cardholder name
  const holderTrimmed = (card.cardholderName || "").trim();
  if (!holderTrimmed) {
    errors.cardholderName = "Cardholder name is required.";
  } else if (holderTrimmed.length < 3) {
    errors.cardholderName = "Cardholder name must be at least 3 characters.";
  } else if (/\d/.test(holderTrimmed)) {
    errors.cardholderName = "Cardholder name cannot contain numbers.";
  }

  // Card number: Exactly 16 digits
  const cleanDigits = (card.cardNumber || "").replace(/\D/g, "");
  if (!cleanDigits) {
    errors.cardNumber = "Card number is required.";
  } else if (cleanDigits.length !== 16) {
    errors.cardNumber = "Enter a valid 16-digit card number.";
  }

  // Expiry MM/YY: Month 01-12, unexpired
  const cleanExpiry = (card.expiry || "").trim();
  if (!cleanExpiry) {
    errors.expiry = "Expiry date is required (MM/YY).";
  } else if (!/^\d{2}\/\d{2}$/.test(cleanExpiry)) {
    errors.expiry = "Use MM/YY format (e.g. 08/29).";
  } else {
    const [mmStr, yyStr] = cleanExpiry.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (mm < 1 || mm > 12) {
      errors.expiry = "Month must be between 01 and 12.";
    } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      errors.expiry = "Card has expired.";
    } else if (yy > currentYear + 25) {
      errors.expiry = "Invalid future expiry year.";
    }
  }

  // CVV: Strictly exactly 3 digits
  const cleanCvv = (card.cvv || "").replace(/\D/g, "");
  if (!cleanCvv) {
    errors.cvv = "CVV is required.";
  } else if (cleanCvv.length !== 3) {
    errors.cvv = "CVV must contain exactly 3 digits.";
  }

  return errors;
}

/**
 * Validates UPI payment data (name@bank format).
 */
export function validateUpiDetails(upi: UpiPaymentData): Record<string, string> {
  const errors: Record<string, string> = {};
  const upiId = (upi.upiId || "").trim();

  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  if (!upiId) {
    errors.upiId = "UPI ID is required.";
  } else if (!upiRegex.test(upiId)) {
    errors.upiId = "Enter a valid UPI ID (e.g. name@okaxis).";
  }

  return errors;
}

/**
 * Simulates a realistic test/demo payment process with strict error handling.
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
  const latency = options?.latencyMs ?? 1300;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, latency));

  // Check for test decline card or forced failure
  const isDeclineCard =
    method === "card" &&
    typeof paymentData?.cardNumber === "string" &&
    paymentData.cardNumber.replace(/\s/g, "").endsWith("0002");

  if (options?.forceFailure || isDeclineCard) {
    const reason =
      options?.failureReason ||
      (isDeclineCard
        ? "Test Card Declined: The sandbox card issuer declined this test transaction."
        : "Sandbox Authorization Declined: Unable to verify test funds.");

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

  // Success simulation
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
 * Generates clear downloadable test receipt.
 */
export function generateReceiptText(result: PaymentResult): string {
  return `================================================================
LUMORA DIGITAL — TEST / DEMO CHECKOUT RECEIPT
================================================================
Notice: This is a verified frontend test demonstration.
No real financial charge occurred.
----------------------------------------------------------------
Order ID        : ${result.orderId}
Date & Time     : ${new Date(result.timestamp).toLocaleString()}
Status          : PAYMENT COMPLETE (TEST SANDBOX)
Payment Method  : ${result.paymentMethod.toUpperCase()}
----------------------------------------------------------------
CUSTOMER DETAILS:
Name            : ${result.customer.fullName}
Email           : ${result.customer.email}
Phone           : ${result.customer.countryCode} ${result.customer.phone}
Company         : ${result.customer.company || "Direct Client"}
----------------------------------------------------------------
ORDER BREAKDOWN:
Plan Selected   : ${result.order.planName} Package
Quantity        : ${result.order.quantity}
Cadence         : ${result.order.cadence}
Subtotal        : ${result.order.currency}${result.order.subtotal.toLocaleString("en-IN")}
Taxes / Fees    : ₹0.00 (Demo Sandbox)
----------------------------------------------------------------
TOTAL PAID      : ${result.amountFormatted} (DEMO)
================================================================
INCLUDED DELIVERABLES:
${result.order.features.map((f, i) => `• ${f}`).join("\n")}
================================================================
Support & Inquiries: business@lumoradigital.com
Lumora Digital Studio · High-Performance Web Craft.
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
