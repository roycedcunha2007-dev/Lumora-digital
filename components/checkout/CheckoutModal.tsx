"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Check,
  AlertCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Sparkles,
  Smartphone,
  Info,
  Download,
  RotateCcw,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { useCheckout, PlanItem } from "./CheckoutContext";
import {
  paymentService,
  CheckoutOrder,
  CustomerDetails,
  CardPaymentData,
  UpiPaymentData,
  PaymentMethod,
  PaymentResult,
} from "@/lib/paymentService";
import { cn } from "@/lib/utils";

type CheckoutStep = "review" | "payment" | "processing" | "success" | "failure";

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "US / Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+49", label: "Germany (+49)" },
];

const TEST_CARDS: Record<"visa" | "mastercard" | "decline", CardPaymentData> = {
  visa: {
    cardNumber: "4242 4242 4242 4242",
    cardholderName: "Alex Rivera",
    expiry: "12/28",
    cvv: "892",
  },
  mastercard: {
    cardNumber: "5555 5555 5555 4444",
    cardholderName: "Jordan Lee",
    expiry: "09/27",
    cvv: "321",
  },
  decline: {
    cardNumber: "4000 0000 0000 0002",
    cardholderName: "Sam Taylor",
    expiry: "11/26",
    cvv: "002",
  },
};

const SUCCESS_PARTICLES = Array.from({ length: 28 }).map((_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
  const distance = 80 + Math.random() * 80;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 10,
    scale: Math.random() * 0.6 + 0.4,
    color: i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#93C5FD" : "#3B82F6",
  };
});

export default function CheckoutModal() {
  const { isOpen, closeCheckout, selectedPlan, selectPlan, plans } = useCheckout();

  // Multi-step state machine
  const [step, setStep] = useState<CheckoutStep>("review");
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState<CheckoutOrder>(() =>
    paymentService.createCheckoutOrder(selectedPlan, 1)
  );

  // Customer Details Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "9876543210",
    countryCode: "+91",
    company: "Rivera Studio",
    projectNotes: "Looking for high-performance launch by next month.",
  });

  // Payment Method & Details State
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardData, setCardData] = useState<CardPaymentData>({
    cardholderName: "Alex Rivera",
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/28",
    cvv: "892",
  });
  const [upiData, setUpiData] = useState<UpiPaymentData>({
    upiId: "alexrivera@okaxis",
  });

  // Simulation & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [simulateDecline, setSimulateDecline] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(300);
  const [showOrderBreakdown, setShowOrderBreakdown] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [buttonShake, setButtonShake] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Magnetic button physics
  const payBtnRef = useRef<HTMLButtonElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Synchronize order when selectedPlan or quantity updates
  useEffect(() => {
    if (selectedPlan) {
      setOrder(paymentService.createCheckoutOrder(selectedPlan, quantity));
    }
  }, [selectedPlan, quantity]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("review");
      setIsProcessing(false);
      setPaymentResult(null);
      setErrors({});
      setTouched({});
      setQrCountdown(300);
      setOrder(paymentService.createCheckoutOrder(selectedPlan, quantity));
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // QR countdown timer for UPI method
  useEffect(() => {
    if (!isOpen || method !== "upi" || step !== "payment") return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, method, step]);

  // Step 1 -> Step 2 Validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true });

    const validationErrors = paymentService.validateCustomerDetails(customer);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);
      return;
    }

    setErrors({});
    setStep("payment");
  };

  // Card formatting helpers
  const handleCardNumberInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    if (touched.cardNumber) {
      if (digits.length < 15) {
        setErrors((p) => ({ ...p, cardNumber: "Enter a valid 16-digit card number." }));
      } else {
        setErrors((p) => {
          const next = { ...p };
          delete next.cardNumber;
          return next;
        });
      }
    }
  };

  const handleExpiryInput = (val: string) => {
    let digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: digits }));
    if (touched.expiry) {
      if (digits.length < 5) {
        setErrors((p) => ({ ...p, expiry: "Expiry date is required (MM/YY)." }));
      } else {
        setErrors((p) => {
          const next = { ...p };
          delete next.expiry;
          return next;
        });
      }
    }
  };

  const getCardBrand = () => {
    const clean = cardData.cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^(60|65|64[4-9]|622)/.test(clean)) return "RUPAY";
    return "CARD";
  };

  const fillTestCard = (type: "visa" | "mastercard" | "decline") => {
    const card = TEST_CARDS[type];
    setCardData(card);
    if (type === "decline") {
      setSimulateDecline(true);
    } else {
      setSimulateDecline(false);
    }
    setErrors({});
  };

  // Step 2 Submission & Verification
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    let validationErrors: Record<string, string> = {};

    if (method === "card") {
      setTouched({
        cardholderName: true,
        cardNumber: true,
        expiry: true,
        cvv: true,
      });
      validationErrors = paymentService.validateCardDetails(cardData);
    } else if (method === "upi") {
      setTouched({ upiId: true });
      validationErrors = paymentService.validateUpiDetails(upiData);
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);
      return;
    }

    setIsProcessing(true);
    setStep("processing");
    setProcessingStatus("Validating order & credentials...");

    // Simulated 3-stage authorization pipeline
    setTimeout(() => {
      setProcessingStatus("Connecting to sandbox simulator...");

      setTimeout(async () => {
        setProcessingStatus("Authorizing simulated transaction...");

        const result = await paymentService.processDemoPayment(
          order,
          customer,
          method,
          method === "card" ? cardData : upiData,
          {
            forceFailure: simulateDecline,
            failureReason: simulateDecline
              ? "Simulated Bank Decline: The card sandbox declined this test transaction."
              : undefined,
          }
        );

        setIsProcessing(false);
        setPaymentResult(result);

        if (result.success) {
          setStep("success");
        } else {
          setStep("failure");
        }
      }, 700);
    }, 600);
  };

  // Download Receipt
  const handleDownloadReceipt = () => {
    if (!paymentResult) return;
    const text = paymentService.generateReceiptText(paymentResult);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${paymentResult.orderId}-Receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Magnetic Button Hover
  const handleButtonMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = payBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setBtnPos({ x, y });
  };
  const resetBtnPos = () => setBtnPos({ x: 0, y: 0 });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={closeCheckout}
          className="fixed inset-0 bg-black/80 backdrop-blur-[20px]"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/[0.12] bg-[#08080c]/95 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-3xl"
        >
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(255,255,255,0.03)]" />

          {/* Top Bar: Stepper & Demo Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              {step === "payment" && (
                <button
                  onClick={() => setStep("review")}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Order Review</span>
                </button>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                DEMO CHECKOUT SIMULATOR
              </span>
            </div>

            {/* Stepper indicators */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className={cn(step === "review" ? "text-blue-400 font-bold" : "text-white/40")}>
                1. Order Review
              </span>
              <span className="text-white/20">→</span>
              <span
                className={cn(
                  step === "payment" || step === "processing"
                    ? "text-blue-400 font-bold"
                    : "text-white/40"
                )}
              >
                2. Payment Method
              </span>
              <span className="text-white/20">→</span>
              <span
                className={cn(
                  step === "success"
                    ? "text-emerald-400 font-bold"
                    : step === "failure"
                    ? "text-red-400 font-bold"
                    : "text-white/40"
                )}
              >
                3. Verification
              </span>
            </div>

            <button
              onClick={closeCheckout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: ORDER REVIEW & CUSTOMER DETAILS                                    */}
          {/* ========================================================================= */}
          {step === "review" && (
            <div className="grid gap-0 lg:grid-cols-[0.45fr_0.55fr]">
              {/* Left Column: Order Summary & Plan Details */}
              <div className="border-b border-white/[0.08] bg-white/[0.015] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                    Order Summary
                  </span>
                  <span className="text-xs font-mono text-blue-400">Ref: {order.orderId}</span>
                </div>

                {/* Plan Switcher Tabs */}
                <div className="mt-4 flex rounded-xl border border-white/10 bg-black/40 p-1">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPlan(p.id)}
                      className={cn(
                        "flex-1 rounded-lg py-1.5 text-xs font-medium transition-all cursor-pointer",
                        selectedPlan.id === p.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Selected Package Details */}
                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">
                        {order.planName} Package
                      </h3>
                      <p className="mt-1 text-xs text-white/55">{selectedPlan.tagline}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-white">
                        {order.price}
                      </span>
                      <span className="block text-[10px] text-white/40">{order.cadence}</span>
                    </div>
                  </div>

                  <div className="my-4 h-px w-full bg-white/[0.06]" />

                  {/* Features List */}
                  <ul className="space-y-2">
                    {order.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Breakdown */}
                <div className="mt-5 space-y-2 rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Package Subtotal</span>
                    <span className="text-white/90">
                      {order.currency}
                      {order.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>GST (18% Applicable)</span>
                    <span className="text-emerald-400">₹0.00 (Demo Waived)</span>
                  </div>
                  <div className="h-px w-full bg-white/[0.08]" />
                  <div className="flex items-center justify-between text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="font-display text-base text-blue-400">
                      {order.currency}
                      {order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11px] text-white/50">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>Transparent pricing · Guaranteed delivery timeline · No hidden costs.</span>
                </div>
              </div>

              {/* Right Column: Customer Details Form */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                    Customer Information
                  </span>
                  <span className="text-[11px] text-blue-400">* Required for project onboarding</span>
                </div>

                <form onSubmit={handleProceedToPayment} className="mt-5 space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-white/70">
                        Full Name <span className="text-blue-400">*</span>
                      </label>
                      {errors.fullName && (
                        <span className="text-[11px] text-red-400">{errors.fullName}</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={customer.fullName}
                        onChange={(e) => {
                          setCustomer((p) => ({ ...p, fullName: e.target.value }));
                          if (errors.fullName) {
                            setErrors((p) => {
                              const next = { ...p };
                              delete next.fullName;
                              return next;
                            });
                          }
                        }}
                        placeholder="[Your Full Name]"
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                          errors.fullName
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                        )}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-white/70">
                        Email Address <span className="text-blue-400">*</span>
                      </label>
                      {errors.email && (
                        <span className="text-[11px] text-red-400">{errors.email}</span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => {
                        setCustomer((p) => ({ ...p, email: e.target.value }));
                        if (errors.email) {
                          setErrors((p) => {
                            const next = { ...p };
                            delete next.email;
                            return next;
                          });
                        }
                      }}
                      placeholder="name@example.com"
                      className={cn(
                        "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                        errors.email
                          ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                          : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                      )}
                    />
                  </div>

                  {/* Phone Number with Country Code */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-white/70">
                        Phone Number <span className="text-blue-400">*</span>
                      </label>
                      {errors.phone && (
                        <span className="text-[11px] text-red-400">{errors.phone}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={customer.countryCode}
                        onChange={(e) =>
                          setCustomer((p) => ({ ...p, countryCode: e.target.value }))
                        }
                        className="rounded-xl border border-white/[0.08] bg-[#07080c] px-3 py-2.5 text-xs text-white outline-none focus:border-blue-400 cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#08080c] text-white">
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => {
                          setCustomer((p) => ({ ...p, phone: e.target.value }));
                          if (errors.phone) {
                            setErrors((p) => {
                              const next = { ...p };
                              delete next.phone;
                              return next;
                            });
                          }
                        }}
                        placeholder="[10-digit mobile number]"
                        className={cn(
                          "flex-1 rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                          errors.phone
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                        )}
                      />
                    </div>
                  </div>

                  {/* Company / Project Name (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/70">
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={customer.company || ""}
                      onChange={(e) => setCustomer((p) => ({ ...p, company: e.target.value }))}
                      placeholder="[e.g. Acme Studio / Brand Name]"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400 focus:bg-white/[0.04]"
                    />
                  </div>

                  {/* Continue Button */}
                  <motion.button
                    type="submit"
                    animate={buttonShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50 cursor-pointer"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: PAYMENT METHOD & PAYMENT DETAILS                                   */}
          {/* ========================================================================= */}
          {step === "payment" && (
            <div className="p-6 sm:p-8">
              {/* Customer summary snapshot banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 font-bold text-blue-400">
                    {customer.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block font-semibold text-white">{customer.fullName}</span>
                    <span className="block text-white/50">{customer.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-white">
                    {order.planName} · {order.currency}
                    {order.total.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => setStep("review")}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Edit details
                  </button>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="mt-6">
                <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                  Select Payment Method
                </span>

                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                    { id: "upi", label: "UPI / Dynamic QR", icon: QrCode },
                    { id: "gpay", label: "Google Pay", icon: Smartphone },
                    { id: "paypal", label: "PayPal Express", icon: Lock },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setMethod(m.id as PaymentMethod);
                          setErrors({});
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 text-center transition-all cursor-pointer",
                          isSelected
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span className="text-xs font-medium">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Interface */}
              <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
                {/* METHOD 1: CARD */}
                {method === "card" && (
                  <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                    {/* Test Card Quick Fill Helpers */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-white/40">Demo Quick Autofill:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fillTestCard("visa")}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer"
                        >
                          Test Visa (Pass)
                        </button>
                        <button
                          type="button"
                          onClick={() => fillTestCard("mastercard")}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer"
                        >
                          Test Mastercard
                        </button>
                        <button
                          type="button"
                          onClick={() => fillTestCard("decline")}
                          className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-300 hover:border-red-400 cursor-pointer"
                        >
                          Test Decline (Error)
                        </button>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-white/70">
                          Cardholder Name <span className="text-blue-400">*</span>
                        </label>
                        {errors.cardholderName && (
                          <span className="text-[11px] text-red-400">{errors.cardholderName}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={cardData.cardholderName}
                        onChange={(e) => {
                          setCardData((p) => ({ ...p, cardholderName: e.target.value }));
                          if (errors.cardholderName) {
                            setErrors((p) => {
                              const next = { ...p };
                              delete next.cardholderName;
                              return next;
                            });
                          }
                        }}
                        placeholder="[Name on Card]"
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                          errors.cardholderName
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                        )}
                      />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-white/70">
                          Card Number <span className="text-blue-400">*</span>
                        </label>
                        {errors.cardNumber && (
                          <span className="text-[11px] text-red-400">{errors.cardNumber}</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => handleCardNumberInput(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className={cn(
                            "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-16 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                            errors.cardNumber
                              ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                              : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                          )}
                        />
                        <span className="absolute right-3 top-2.5 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          {getCardBrand()}
                        </span>
                      </div>
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-xs font-medium text-white/70">
                            Expiry <span className="text-blue-400">*</span>
                          </label>
                          {errors.expiry && (
                            <span className="text-[10px] text-red-400">{errors.expiry}</span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleExpiryInput(e.target.value)}
                          placeholder="MM/YY"
                          className={cn(
                            "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                            errors.expiry
                              ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                              : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                          )}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-xs font-medium text-white/70">
                            CVV / CVC <span className="text-blue-400">*</span>
                          </label>
                          {errors.cvv && (
                            <span className="text-[10px] text-red-400">{errors.cvv}</span>
                          )}
                        </div>
                        <input
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setCardData((p) => ({ ...p, cvv: val }));
                            if (errors.cvv) {
                              setErrors((p) => {
                                const next = { ...p };
                                delete next.cvv;
                                return next;
                              });
                            }
                          }}
                          placeholder="123"
                          maxLength={4}
                          className={cn(
                            "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                            errors.cvv
                              ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                              : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* METHOD 2: UPI */}
                {method === "upi" && (
                  <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                    {/* Simulated SVG QR Code */}
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <div className="relative flex h-36 w-36 items-center justify-center rounded-xl border border-white/15 bg-white p-2.5 shadow-xl">
                        <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          <rect x="6" y="6" width="26" height="26" rx="4" fill="black" />
                          <rect x="10" y="10" width="18" height="18" rx="2" fill="white" />
                          <rect x="14" y="14" width="10" height="10" fill="#2563eb" />

                          <rect x="68" y="6" width="26" height="26" rx="4" fill="black" />
                          <rect x="72" y="10" width="18" height="18" rx="2" fill="white" />
                          <rect x="76" y="14" width="10" height="10" fill="#2563eb" />

                          <rect x="6" y="68" width="26" height="26" rx="4" fill="black" />
                          <rect x="10" y="72" width="18" height="18" rx="2" fill="white" />
                          <rect x="14" y="76" width="10" height="10" fill="#2563eb" />

                          <circle cx="42" cy="18" r="3" fill="#1e293b" />
                          <circle cx="54" cy="18" r="3" fill="#1e293b" />
                          <circle cx="48" cy="30" r="3" fill="#2563eb" />
                          <circle cx="18" cy="48" r="3" fill="#1e293b" />
                          <circle cx="32" cy="48" r="3" fill="#1e293b" />
                          <circle cx="48" cy="48" r="4" fill="black" />
                          <circle cx="64" cy="48" r="3" fill="#2563eb" />
                          <circle cx="82" cy="48" r="3" fill="#1e293b" />
                          <circle cx="48" cy="66" r="3" fill="#1e293b" />
                          <circle cx="64" cy="66" r="3" fill="#1e293b" />
                          <circle cx="82" cy="66" r="3" fill="#1e293b" />
                          <circle cx="42" cy="82" r="3" fill="#2563eb" />
                          <circle cx="58" cy="82" r="3" fill="#1e293b" />
                        </svg>

                        <div className="absolute flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-display text-xs font-bold text-white shadow-md">
                          L
                        </div>

                        <motion.div
                          animate={{ y: [-45, 45, -45] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                          className="pointer-events-none absolute inset-x-2 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs font-mono text-white/70">
                        <span>Scan with GPay / PhonePe / Paytm</span>
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                          {Math.floor(qrCountdown / 60)}:
                          {(qrCountdown % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* UPI ID Field */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-white/70">
                          Or Enter UPI VPA <span className="text-blue-400">*</span>
                        </label>
                        {errors.upiId && (
                          <span className="text-[11px] text-red-400">{errors.upiId}</span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiData.upiId}
                          onChange={(e) => {
                            setUpiData({ upiId: e.target.value });
                            if (errors.upiId) {
                              setErrors((p) => {
                                const next = { ...p };
                                delete next.upiId;
                                return next;
                              });
                            }
                          }}
                          placeholder="yourname@okaxis"
                          className={cn(
                            "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-24 text-sm text-white placeholder-white/25 outline-none transition-all",
                            errors.upiId
                              ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                              : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUpiData({ upiId: "lumoraclient@okaxis" });
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="absolute right-2 top-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          {copiedUpi ? "Filled!" : "Demo ID"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* METHOD 3: GOOGLE PAY */}
                {method === "gpay" && (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy-950 font-bold text-xs shadow-md">
                          GPay
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-white">
                            Google Pay Sandbox Account
                          </span>
                          <span className="block text-xs text-white/50">{customer.email}</span>
                        </div>
                      </div>
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Ready
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">HDFC Bank Premium Debit Card</span>
                        <span className="font-mono text-white/50">•••• 4092</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* METHOD 4: PAYPAL */}
                {method === "paypal" && (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070BA] font-display text-sm font-bold text-white shadow-md">
                          P
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-white">
                            PayPal Express Simulation
                          </span>
                          <span className="block text-xs text-white/50">
                            alex.rivera@paypal-demo.com
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                        Verified
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <span>PayPal Balance (Sandbox)</span>
                        <span className="font-semibold text-emerald-400">$2,450.00</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Simulation Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-3.5 py-2.5 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-blue-400" />
                    <span>Simulate Bank Decline for Testing</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulateDecline((v) => !v)}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer",
                      simulateDecline ? "bg-red-500" : "bg-white/20"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                        simulateDecline ? "translate-x-4.5" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {/* Final Pay Button with Exact Amount */}
                <motion.button
                  ref={payBtnRef}
                  type="submit"
                  disabled={isProcessing}
                  onMouseMove={handleButtonMove}
                  onMouseLeave={resetBtnPos}
                  animate={
                    buttonShake
                      ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                      : { x: btnPos.x, y: btnPos.y }
                  }
                  transition={{ type: "spring", stiffness: 240, damping: 16 }}
                  className={cn(
                    "group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 cursor-pointer",
                    isProcessing
                      ? "bg-blue-700/80 cursor-wait"
                      : "bg-blue-600 shadow-[0_8px_32px_rgba(59,130,246,0.35)] hover:bg-blue-500 hover:shadow-[0_12px_45px_rgba(59,130,246,0.5)]"
                  )}
                >
                  <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>
                      Pay {order.currency}
                      {order.total.toLocaleString("en-IN")} (Demo Checkout)
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: PROCESSING STATE                                                  */}
          {/* ========================================================================= */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-3 border-blue-500/20 border-t-blue-400" />
                <Lock className="absolute h-6 w-6 text-blue-400" />
              </div>

              <h3 className="mt-6 font-display text-xl font-bold text-white">
                Processing Payment...
              </h3>
              <p className="mt-2 text-sm text-white/60">{processingStatus}</p>

              <div className="mt-6 w-48 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
              </div>

              <span className="mt-6 text-[11px] text-white/40 font-mono">
                Do not refresh or close this window
              </span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4A: SUCCESS EXPERIENCE                                               */}
          {/* ========================================================================= */}
          {step === "success" && paymentResult && (
            <div className="relative p-8 text-center sm:p-12">
              {/* Confetti */}
              {SUCCESS_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0, p.scale, 0],
                    opacity: [1, 0.9, 0],
                  }}
                  transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ backgroundColor: p.color }}
                  className="pointer-events-none absolute left-1/2 top-20 h-2 w-2 rounded-full"
                />
              ))}

              {/* Success Checkmark */}
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-[0_0_35px_rgba(59,130,246,0.5)]"
                />
                <svg className="relative z-10 h-10 w-10 text-white" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
                  />
                </svg>
                <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-blue-200 fill-blue-200" />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                ✓ Demo Payment Completed
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
                className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/65"
              >
                Thank you, <span className="font-semibold text-white">{customer.fullName}</span>!
                Your order is confirmed in the demo sandbox.
              </motion.p>

              {/* Order Receipt Summary Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/[0.08] bg-[#07080c]/80 p-5 text-left text-xs text-white/70"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 font-mono">
                  <span className="text-white/40">Order ID</span>
                  <span className="font-bold text-blue-400">{paymentResult.orderId}</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/50">Plan Purchased</span>
                    <span className="font-medium text-white">{order.planName} Package</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Amount Paid (Demo)</span>
                    <span className="font-medium text-white">
                      {order.currency}
                      {order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Customer Email</span>
                    <span className="font-medium text-white">{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Payment Method</span>
                    <span className="font-medium uppercase text-blue-300">{method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Status</span>
                    <span className="font-semibold text-emerald-400">SUCCESS (SANDBOX)</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.45 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
              >
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-blue-400/40 hover:bg-white/[0.08] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-blue-400" />
                  <span>Download Demo Receipt</span>
                </button>

                <button
                  onClick={closeCheckout}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 cursor-pointer"
                >
                  <span>Return Home</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>

              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-2.5 text-[11px] text-blue-300 max-w-lg mx-auto">
                Notice: Demo checkout — no real payment was processed.
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4B: FAILURE / DECLINE STATE                                          */}
          {/* ========================================================================= */}
          {step === "failure" && paymentResult && (
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Payment Could Not Be Completed
              </h3>

              <div className="mx-auto mt-4 max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-left text-xs">
                <span className="font-semibold text-red-300">Failure Reason:</span>
                <p className="mt-1 text-white/80 leading-relaxed">
                  {paymentResult.failureReason ||
                    "The transaction could not be authorized by the test sandbox simulator."}
                </p>
              </div>

              {/* Action Buttons for Failure State */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSimulateDecline(false);
                    setStep("payment");
                  }}
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={() => setStep("payment")}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-white/25 cursor-pointer"
                >
                  <span>Change Payment Method</span>
                </button>

                <button
                  onClick={() => setStep("review")}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:text-white cursor-pointer"
                >
                  <span>Return to Order Review</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
