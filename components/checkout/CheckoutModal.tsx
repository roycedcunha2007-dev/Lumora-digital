"use client";

import { useState, useRef, useEffect, MouseEvent, useMemo } from "react";
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
  Sparkles,
  Smartphone,
  Info,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useCheckout } from "./CheckoutContext";
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
    email: "alex.rivera@gmail.com",
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
  const [showCvv, setShowCvv] = useState(false);
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);
  const [upiData, setUpiData] = useState<UpiPaymentData>({
    upiId: "alexrivera@okaxis",
  });

  // Simulation & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [simulateDecline, setSimulateDecline] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(300);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [buttonShake, setButtonShake] = useState(false);

  // 3D Virtual Card Mouse Tilt Physics
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  // Pay Button Magnetic Physics
  const payBtnRef = useRef<HTMLButtonElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Touched state for displaying validation errors
  const [touched, setTouched] = useState<Record<string, boolean>>({
    fullName: true,
    email: true,
    phone: true,
    cardholderName: true,
    cardNumber: true,
    expiry: true,
    cvv: true,
    upiId: true,
  });

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

  // --------------------------------------------------------------------------
  // REAL-TIME VALIDATION CALCULATIONS (Evaluates instantly as user types)
  // --------------------------------------------------------------------------
  const customerErrors = useMemo(() => {
    return paymentService.validateCustomerDetails(customer);
  }, [customer]);

  const cardErrors = useMemo(() => {
    return paymentService.validateCardDetails(cardData);
  }, [cardData]);

  const upiErrors = useMemo(() => {
    return paymentService.validateUpiDetails(upiData);
  }, [upiData]);

  // Boolean validity states for Step 1
  const isCustomerValid = useMemo(() => {
    return Object.keys(customerErrors).length === 0;
  }, [customerErrors]);

  // Boolean validity states for Step 2
  const isPaymentValid = useMemo(() => {
    if (method === "card") {
      return Object.keys(cardErrors).length === 0;
    }
    if (method === "upi") {
      return Object.keys(upiErrors).length === 0;
    }
    if (method === "gpay" || method === "paypal") {
      return true;
    }
    return false;
  }, [method, cardErrors, upiErrors]);

  // Pay button disabled state: strictly required conditions
  const isPayButtonEnabled = useMemo(() => {
    return isCustomerValid && isPaymentValid && !isProcessing;
  }, [isCustomerValid, isPaymentValid, isProcessing]);

  // --------------------------------------------------------------------------
  // STRICT INPUT FORMATTING & HANDLERS
  // --------------------------------------------------------------------------
  const handleFullNameInput = (val: string) => {
    const clean = val.replace(/[^a-zA-Z\s.'-]/g, "");
    setCustomer((p) => ({ ...p, fullName: clean }));
    setTouched((p) => ({ ...p, fullName: true }));
  };

  const handleEmailInput = (val: string) => {
    setCustomer((p) => ({ ...p, email: val.trim() }));
    setTouched((p) => ({ ...p, email: true }));
  };

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setCustomer((p) => ({ ...p, phone: digits }));
    setTouched((p) => ({ ...p, phone: true }));
  };

  const handleCardholderInput = (val: string) => {
    const clean = val.replace(/[^a-zA-Z\s.'-]/g, "");
    setCardData((p) => ({ ...p, cardholderName: clean }));
    setTouched((p) => ({ ...p, cardholderName: true }));
  };

  const handleCardNumberInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    setTouched((p) => ({ ...p, cardNumber: true }));
  };

  const handleExpiryInput = (val: string) => {
    let digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    setCardData((prev) => ({ ...prev, expiry: digits }));
    setTouched((p) => ({ ...p, expiry: true }));
  };

  const handleCvvInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 3);
    setCardData((prev) => ({ ...prev, cvv: digits }));
    setTouched((p) => ({ ...p, cvv: true }));
  };

  // Card network detection
  const getCardBrand = () => {
    const clean = cardData.cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^(60|65|64[4-9]|622)/.test(clean)) return "RUPAY";
    return "CARD";
  };

  // Virtual card last 4 digits helper
  const cardLast4 = useMemo(() => {
    const clean = cardData.cardNumber.replace(/\s/g, "");
    return clean.length >= 4 ? clean.slice(-4) : "••••";
  }, [cardData.cardNumber]);

  // Virtual Card 3D Tilt handler
  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rx = (py - 0.5) * -16;
    const ry = (px - 0.5) * 16;
    setCardTilt({ rx, ry, glareX: px * 100, glareY: py * 100 });
  };
  const resetCardTilt = () => setCardTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  // Quick fill test cards
  const fillTestCard = (type: "visa" | "mastercard" | "decline") => {
    const card = TEST_CARDS[type];
    setCardData(card);
    if (type === "decline") {
      setSimulateDecline(true);
    } else {
      setSimulateDecline(false);
    }
    setTouched((p) => ({
      ...p,
      cardholderName: true,
      cardNumber: true,
      expiry: true,
      cvv: true,
    }));
  };

  // Step 1 -> Step 2 Navigation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true });

    if (!isCustomerValid) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);
      return;
    }

    setStep("payment");
  };

  // Step 2 Submission & Verification
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPayButtonEnabled || isProcessing) return;

    setIsProcessing(true);
    setStep("processing");
    setProcessingStatus("Validating order & credentials...");

    // Simulated 3-stage authorization pipeline
    setTimeout(() => {
      setProcessingStatus("Connecting to test sandbox simulator...");

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
              ? "Test Card Declined: The sandbox card issuer declined this test transaction."
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
      }, 750);
    }, 650);
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

  // Magnetic Button Hover Physics
  const handleButtonMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isPayButtonEnabled) return;
    const el = payBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setBtnPos({ x, y });
  };
  const resetBtnPos = () => setBtnPos({ x: 0, y: 0 });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
          {/* Subtle Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeCheckout}
            className="fixed inset-0 bg-black/80 backdrop-blur-[16px]"
          />

          {/* Liquid Glass Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/[0.12] bg-[#07080c]/95 shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* Subtle Liquid Glass Ambient Glow */}
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/12 blur-[100px]" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(255,255,255,0.02)]" />

            {/* ========================================================================= */}
            {/* PROGRESS INDICATOR HEADER                                                 */}
            {/* ========================================================================= */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-6 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                {step === "payment" && (
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>01 Details</span>
                  </button>
                )}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  DEMO CHECKOUT
                </span>
              </div>

              {/* 01 Details → 02 Payment → 03 Confirmation */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      step === "review"
                        ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "bg-white/10 text-emerald-400"
                    )}
                  >
                    {step !== "review" ? <Check className="h-3 w-3" /> : "01"}
                  </span>
                  <span className={cn(step === "review" ? "text-white font-semibold" : "text-white/40")}>
                    Details
                  </span>
                </div>

                <span className="text-white/20">→</span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      step === "payment" || step === "processing"
                        ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : step === "success"
                        ? "bg-white/10 text-emerald-400"
                        : "bg-white/5 text-white/40"
                    )}
                  >
                    {step === "success" ? <Check className="h-3 w-3" /> : "02"}
                  </span>
                  <span
                    className={cn(
                      step === "payment" || step === "processing"
                        ? "text-white font-semibold"
                        : "text-white/40"
                    )}
                  >
                    Payment
                  </span>
                </div>

                <span className="text-white/20">→</span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                      step === "success"
                        ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : step === "failure"
                        ? "bg-red-500 text-white"
                        : "bg-white/5 text-white/40"
                    )}
                  >
                    03
                  </span>
                  <span
                    className={cn(
                      step === "success"
                        ? "text-emerald-400 font-semibold"
                        : step === "failure"
                        ? "text-red-400 font-semibold"
                        : "text-white/40"
                    )}
                  >
                    Confirmation
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeCheckout}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close checkout"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ========================================================================= */}
            {/* MAIN TWO-COLUMN CHECKOUT LAYOUT (Desktop: Left Form / Right Receipt)        */}
            {/* ========================================================================= */}
            {(step === "review" || step === "payment") && (
              <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                {/* ----------------------------------------------------------------------- */}
                {/* LEFT COLUMN: PAYMENT FORM & 3D VIRTUAL CARD PREVIEW                    */}
                {/* ----------------------------------------------------------------------- */}
                <div className="p-6 sm:p-8 lg:border-r border-white/[0.08]">
                  {/* STEP 1: CUSTOMER DETAILS FORM */}
                  {step === "review" && (
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                          Customer Information
                        </span>
                        <span className="text-[11px] text-blue-400">Step 01 of 02</span>
                      </div>

                      <form onSubmit={handleProceedToPayment} className="mt-6 space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-white/70">
                              Full Name <span className="text-blue-400">*</span>
                            </label>
                            {touched.fullName && (
                              customerErrors.fullName ? (
                                <span className="text-[11px] text-red-400 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {customerErrors.fullName}
                                </span>
                              ) : (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Valid
                                </span>
                              )
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.fullName}
                              onChange={(e) => handleFullNameInput(e.target.value)}
                              placeholder="Alex Rivera"
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
                                touched.fullName && customerErrors.fullName
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : touched.fullName && !customerErrors.fullName
                                  ? "border-emerald-500/60 focus:border-emerald-400"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-white/70">
                              Email Address <span className="text-blue-400">*</span>
                            </label>
                            {touched.email && (
                              customerErrors.email ? (
                                <span className="text-[11px] text-red-400 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {customerErrors.email}
                                </span>
                              ) : (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Valid format
                                </span>
                              )
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="email"
                              value={customer.email}
                              onChange={(e) => handleEmailInput(e.target.value)}
                              placeholder="customer@gmail.com"
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
                                touched.email && customerErrors.email
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : touched.email && !customerErrors.email
                                  ? "border-emerald-500/60 focus:border-emerald-400"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                          </div>
                        </div>

                        {/* Phone Number Field with Country Code */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-white/70">
                              Phone Number <span className="text-blue-400">*</span>
                            </label>
                            {touched.phone && (
                              customerErrors.phone ? (
                                <span className="text-[11px] text-red-400 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" /> {customerErrors.phone}
                                </span>
                              ) : (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Valid (10 digits)
                                </span>
                              )
                            )}
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={customer.countryCode}
                              onChange={(e) =>
                                setCustomer((p) => ({ ...p, countryCode: e.target.value }))
                              }
                              className="rounded-xl border border-white/[0.08] bg-[#07080c] px-3 py-3 text-xs text-white outline-none focus:border-blue-400 cursor-pointer"
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
                              onChange={(e) => handlePhoneInput(e.target.value)}
                              placeholder="9876543210"
                              maxLength={10}
                              className={cn(
                                "flex-1 rounded-xl border bg-white/[0.025] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
                                touched.phone && customerErrors.phone
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : touched.phone && !customerErrors.phone
                                  ? "border-emerald-500/60 focus:border-emerald-400"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                          </div>
                        </div>

                        {/* Company Name Field (Optional) */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-white/70">
                            Company / Organization (Optional)
                          </label>
                          <input
                            type="text"
                            value={customer.company || ""}
                            onChange={(e) => setCustomer((p) => ({ ...p, company: e.target.value }))}
                            placeholder="Rivera Studio"
                            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400 focus:bg-white/[0.04]"
                          />
                        </div>

                        {/* Continue to Payment Button */}
                        <motion.button
                          type="submit"
                          disabled={!isCustomerValid}
                          animate={buttonShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className={cn(
                            "group mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-300",
                            isCustomerValid
                              ? "bg-blue-600 shadow-blue-500/30 hover:bg-blue-500 hover:shadow-blue-500/50 cursor-pointer"
                              : "bg-white/10 opacity-50 cursor-not-allowed text-white/40"
                          )}
                        >
                          <span>Proceed to Payment</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.button>
                      </form>
                    </div>
                  )}

                  {/* STEP 2: PAYMENT METHOD & 3D VIRTUAL CARD PREVIEW */}
                  {step === "payment" && (
                    <div className="space-y-6">
                      {/* ================================================================= */}
                      {/* PAYMENT METHOD SELECTOR CARDS: [ GPay ] [ PayPal ] [ Card ] [ UPI ]*/}
                      {/* ================================================================= */}
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                          Payment Method
                        </span>

                        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                          {[
                            { id: "gpay", label: "Google Pay", icon: Smartphone },
                            { id: "paypal", label: "PayPal", icon: Lock },
                            { id: "card", label: "Card", icon: CreditCard },
                            { id: "upi", label: "UPI", icon: QrCode },
                          ].map((m) => {
                            const Icon = m.icon;
                            const isSelected = method === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setMethod(m.id as PaymentMethod)}
                                className={cn(
                                  "group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 text-center transition-all duration-300 cursor-pointer",
                                  isSelected
                                    ? "border-blue-500/60 bg-blue-500/15 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.22)] scale-[1.02]"
                                    : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                                )}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="methodCheck"
                                    className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm"
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                  </motion.div>
                                )}
                                <Icon className={cn("h-5 w-5 transition-transform duration-300", isSelected && "scale-110 text-blue-400")} />
                                <span className="text-xs font-medium">{m.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* ================================================================= */}
                      {/* 3D VIRTUAL CARD PREVIEW (Credit/Debit Card selected)               */}
                      {/* ================================================================= */}
                      {method === "card" && (
                        <div
                          ref={cardRef}
                          onMouseMove={handleCardMouseMove}
                          onMouseLeave={resetCardTilt}
                          style={{ perspective: 1000 }}
                          className="relative cursor-pointer select-none"
                        >
                          <motion.div
                            animate={{
                              rotateX: cardTilt.rx,
                              rotateY: cardTilt.ry,
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="relative h-48 sm:h-52 w-full overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#121420] via-[#090b14] to-[#04060c] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(59,130,246,0.15)]"
                          >
                            {/* Micro-dot grid background */}
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px]" />

                            {/* Dynamic Holographic Specular Glare Reflection */}
                            <div
                              style={{
                                background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.22) 0%, rgba(59,130,246,0.12) 40%, transparent 70%)`,
                              }}
                              className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                            />

                            {/* EMV Gold Chip Illustration & Contactless Wave */}
                            <div className="relative z-10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Gold Chip */}
                                <div className="h-8 w-11 rounded-lg border border-amber-300/40 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-md flex items-center justify-center">
                                  <div className="h-6 w-9 rounded border border-amber-700/40 bg-amber-300/30 grid grid-cols-3 gap-0.5 p-0.5">
                                    <div className="border-r border-amber-800/30" />
                                    <div className="border-r border-amber-800/30" />
                                    <div />
                                  </div>
                                </div>

                                {/* Contactless Wave Icon */}
                                <svg className="h-5 w-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12a2.5 2.5 0 0 0-2.5-2.5" />
                                  <path d="M5.5 17.5A6.5 6.5 0 0 0 12 11a6.5 6.5 0 0 0-6.5-6.5" />
                                  <path d="M2.5 20.5A10.5 10.5 0 0 0 13 10a10.5 10.5 0 0 0-10.5-10.5" />
                                </svg>
                              </div>

                              {/* Card Brand Badge */}
                              <div className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-black tracking-wider text-white">
                                {getCardBrand()}
                              </div>
                            </div>

                            {/* Masked Card Number: •••• •••• •••• 3456 */}
                            <div className="relative z-10 mt-6 font-mono text-lg sm:text-xl font-medium tracking-[0.22em] text-white/90 drop-shadow">
                              •••• •••• •••• {cardLast4}
                            </div>

                            {/* Cardholder & Expiry */}
                            <div className="relative z-10 mt-4 flex items-end justify-between text-xs font-mono">
                              <div>
                                <span className="block text-[9px] uppercase tracking-widest text-white/40">
                                  Cardholder Name
                                </span>
                                <span className="block font-semibold uppercase text-white/90 truncate max-w-[180px]">
                                  {cardData.cardholderName || "ALEX RIVERA"}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="block text-[9px] uppercase tracking-widest text-white/40">
                                  Expires
                                </span>
                                <span className="block font-semibold text-white/90">
                                  {cardData.expiry || "MM/YY"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}

                      {/* Dynamic Payment Forms */}
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        {/* METHOD: CARD */}
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
                                  Test Visa (16 Digits)
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
                                  Test Decline
                                </button>
                              </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-white/70">
                                  Cardholder Name <span className="text-blue-400">*</span>
                                </label>
                                {touched.cardholderName && (
                                  cardErrors.cardholderName ? (
                                    <span className="text-[11px] text-red-400 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {cardErrors.cardholderName}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Valid
                                    </span>
                                  )
                                )}
                              </div>
                              <input
                                type="text"
                                value={cardData.cardholderName}
                                onChange={(e) => handleCardholderInput(e.target.value)}
                                placeholder="Alex Rivera"
                                className={cn(
                                  "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
                                  touched.cardholderName && cardErrors.cardholderName
                                    ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                    : touched.cardholderName && !cardErrors.cardholderName
                                    ? "border-emerald-500/60 focus:border-emerald-400"
                                    : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                                )}
                              />
                            </div>

                            {/* Card Number */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-white/70">
                                  Card Number (16 Digits) <span className="text-blue-400">*</span>
                                </label>
                                {touched.cardNumber && (
                                  cardErrors.cardNumber ? (
                                    <span className="text-[11px] text-red-400 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {cardErrors.cardNumber}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" /> Valid 16 digits
                                    </span>
                                  )
                                )}
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={cardData.cardNumber}
                                  onChange={(e) => handleCardNumberInput(e.target.value)}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  className={cn(
                                    "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-20 text-sm font-mono text-white placeholder-white/25 outline-none transition-all duration-200",
                                    touched.cardNumber && cardErrors.cardNumber
                                      ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                      : touched.cardNumber && !cardErrors.cardNumber
                                      ? "border-emerald-500/60 focus:border-emerald-400"
                                      : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                                  )}
                                />
                                <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                                  {touched.cardNumber && !cardErrors.cardNumber && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  )}
                                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                                    {getCardBrand()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Expiry & CVV */}
                            <div className="grid grid-cols-2 gap-3">
                              {/* Expiry MM/YY */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-medium text-white/70">
                                    Expiry (MM/YY) <span className="text-blue-400">*</span>
                                  </label>
                                  {touched.expiry && (
                                    cardErrors.expiry ? (
                                      <span className="text-[10px] text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-2.5 w-2.5" /> {cardErrors.expiry}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="h-2.5 w-2.5" /> Valid
                                      </span>
                                    )
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={cardData.expiry}
                                  onChange={(e) => handleExpiryInput(e.target.value)}
                                  placeholder="08/29"
                                  maxLength={5}
                                  className={cn(
                                    "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 outline-none transition-all duration-200",
                                    touched.expiry && cardErrors.expiry
                                      ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                      : touched.expiry && !cardErrors.expiry
                                      ? "border-emerald-500/60 focus:border-emerald-400"
                                      : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                                  )}
                                />
                              </div>

                              {/* CVV (Strictly 3 digits, masked) */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1">
                                    <label className="text-xs font-medium text-white/70">
                                      CVV <span className="text-blue-400">*</span>
                                    </label>
                                    <div
                                      className="relative"
                                      onMouseEnter={() => setShowCvvTooltip(true)}
                                      onMouseLeave={() => setShowCvvTooltip(false)}
                                    >
                                      <HelpCircle className="h-3 w-3 text-white/40 hover:text-white cursor-pointer" />
                                      {showCvvTooltip && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[10px] text-white border border-white/10 shadow-lg z-50">
                                          3-digit security code
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {touched.cvv && (
                                    cardErrors.cvv ? (
                                      <span className="text-[10px] text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-2.5 w-2.5" /> {cardErrors.cvv}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="h-2.5 w-2.5" /> 3 digits
                                      </span>
                                    )
                                  )}
                                </div>
                                <div className="relative">
                                  <input
                                    type={showCvv ? "text" : "password"}
                                    inputMode="numeric"
                                    value={cardData.cvv}
                                    onChange={(e) => handleCvvInput(e.target.value)}
                                    placeholder="•••"
                                    maxLength={3}
                                    className={cn(
                                      "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-12 text-sm font-mono text-white placeholder-white/25 outline-none transition-all duration-200 tracking-widest",
                                      touched.cvv && cardErrors.cvv
                                        ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                        : touched.cvv && !cardErrors.cvv
                                        ? "border-emerald-500/60 focus:border-emerald-400"
                                        : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04]"
                                    )}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowCvv((v) => !v)}
                                    className="absolute right-3 top-2.5 text-white/40 hover:text-white/80 cursor-pointer"
                                    aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                                  >
                                    {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* METHOD: UPI */}
                        {method === "upi" && (
                          <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5 text-center">
                            <div className="flex flex-col items-center justify-center">
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

                                  <circle cx="48" cy="48" r="4" fill="black" />
                                  <circle cx="48" cy="30" r="3" fill="#2563eb" />
                                  <circle cx="64" cy="48" r="3" fill="#2563eb" />
                                  <circle cx="42" cy="82" r="3" fill="#2563eb" />
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
                                <span>Scan via GPay / PhonePe</span>
                                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                                  {Math.floor(qrCountdown / 60)}:
                                  {(qrCountdown % 60).toString().padStart(2, "0")}
                                </span>
                              </div>
                            </div>

                            {/* UPI ID Field */}
                            <div className="space-y-1 text-left">
                              <label className="text-xs font-medium text-white/70">
                                Or Enter UPI ID <span className="text-blue-400">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={upiData.upiId}
                                  onChange={(e) => {
                                    setUpiData({ upiId: e.target.value.trim() });
                                    setTouched((p) => ({ ...p, upiId: true }));
                                  }}
                                  placeholder="yourname@okaxis"
                                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 pr-24 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUpiData({ upiId: "lumoraclient@okaxis" });
                                    setCopiedUpi(true);
                                    setTouched((p) => ({ ...p, upiId: true }));
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

                        {/* METHOD: GOOGLE PAY */}
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
                          </div>
                        )}

                        {/* METHOD: PAYPAL */}
                        {method === "paypal" && (
                          <div className="rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0070BA] font-display text-sm font-bold text-white shadow-md">
                                  P
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-white">
                                    PayPal Express Sandbox
                                  </span>
                                  <span className="block text-xs text-white/50">alex.rivera@paypal-demo.com</span>
                                </div>
                              </div>
                              <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                                Verified
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Error Simulation Toggle */}
                        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-3.5 py-2.5 text-xs text-white/60">
                          <div className="flex items-center gap-2">
                            <Info className="h-3.5 w-3.5 text-blue-400" />
                            <span>Simulate Card Decline for Testing</span>
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

                        {/* Final Pay Button with Exact Amount and Disabled State */}
                        <motion.button
                          ref={payBtnRef}
                          type="submit"
                          disabled={!isPayButtonEnabled}
                          onMouseMove={handleButtonMove}
                          onMouseLeave={resetBtnPos}
                          animate={
                            buttonShake
                              ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                              : { x: btnPos.x, y: btnPos.y }
                          }
                          transition={{ type: "spring", stiffness: 280, damping: 18 }}
                          className={cn(
                            "group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-300",
                            isPayButtonEnabled
                              ? "bg-blue-600 shadow-[0_8px_32px_rgba(59,130,246,0.35)] hover:bg-blue-500 hover:shadow-[0_12px_45px_rgba(59,130,246,0.5)] cursor-pointer"
                              : "bg-white/10 opacity-50 cursor-not-allowed text-white/40"
                          )}
                        >
                          <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />
                          <span className="relative z-10 flex items-center gap-2">
                            {isProcessing ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>PAY {order.currency}{order.total.toLocaleString("en-IN")}</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </span>
                        </motion.button>

                        {/* Subtle Trust Area */}
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/45">
                          <Lock className="h-3 w-3 text-blue-400" />
                          <span>Secure checkout — Your payment details are handled securely.</span>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------------------------- */}
                {/* RIGHT COLUMN: DIGITAL GLASS RECEIPT / ORDER SUMMARY                     */}
                {/* ----------------------------------------------------------------------- */}
                <div className="border-t border-white/[0.08] bg-white/[0.015] p-6 sm:p-8 lg:border-t-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                        Order Summary
                      </span>
                      <span className="text-xs font-mono text-blue-400">{order.orderId}</span>
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

                      {/* Subtle Animated Divider */}
                      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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
                    <div className="mt-5 space-y-2.5 rounded-2xl border border-white/[0.06] bg-black/25 p-4 text-xs">
                      <div className="flex justify-between text-white/60">
                        <span>Product / Plan</span>
                        <span className="text-white/90">{order.planName} Architecture</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Quantity</span>
                        <span className="text-white/90">{order.quantity}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>Subtotal</span>
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

                      {/* Visually Dominant Total */}
                      <div className="flex items-center justify-between text-sm font-bold text-white pt-1">
                        <span>Total Due</span>
                        <span className="font-display text-lg text-blue-400">
                          {order.currency}
                          {order.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-[11px] text-white/50">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-blue-400" />
                    <span>Transparent pricing · Direct developer onboarding · Sub-second delivery guarantee.</span>
                  </div>
                </div>
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
                  Processing payment...
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
                  Simulating verified sandbox execution
                </span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4A: SUCCESS STATE                                                    */}
            {/* ========================================================================= */}
            {step === "success" && paymentResult && (
              <div className="relative p-8 text-center sm:p-12">
                {/* Minimal Elegant SVG Checkmark Drawing */}
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
                      transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
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
                  ✓ Payment Complete
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.45 }}
                  className="mt-2 font-display text-3xl font-bold text-blue-400"
                >
                  {order.currency}{order.total.toLocaleString("en-IN")}
                </motion.div>

                <p className="mt-1 text-xs font-mono text-white/50">
                  Order #{paymentResult.orderId}
                </p>

                {/* Digital Receipt Snapshot */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.45 }}
                  className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/[0.08] bg-[#07080c]/80 p-5 text-left text-xs text-white/70"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/50">Plan Purchased</span>
                      <span className="font-medium text-white">{order.planName} Package</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Customer Email</span>
                      <span className="font-medium text-white">{customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Payment Channel</span>
                      <span className="font-medium uppercase text-blue-300">{method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Sandbox Status</span>
                      <span className="font-semibold text-emerald-400">VERIFIED DEMO</span>
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
                    type="button"
                    onClick={() => setShowOrderSummaryModal((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-blue-400/40 hover:bg-white/[0.08] cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-blue-400" />
                    <span>{showOrderSummaryModal ? "Hide Summary" : "View Order"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-blue-400/40 hover:bg-white/[0.08] cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-400" />
                    <span>Download Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeCheckout}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 cursor-pointer"
                  >
                    <span>Return Home</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </motion.div>

                {/* Collapsible Order Summary View */}
                {showOrderSummaryModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mx-auto mt-6 max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-left text-xs text-white/70"
                  >
                    <span className="block font-semibold text-white mb-2">Included Deliverables:</span>
                    <ul className="space-y-1 text-white/60">
                      {order.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-emerald-400" /> {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-2.5 text-[11px] text-blue-300 max-w-lg mx-auto">
                  Test checkout — no real payment was processed.
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4B: FAILURE STATE                                                    */}
            {/* ========================================================================= */}
            {step === "failure" && paymentResult && (
              <div className="p-8 text-center sm:p-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_35px_rgba(239,68,68,0.25)]">
                  <XCircle className="h-10 w-10 text-red-400" />
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Payment could not be completed.
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
                    type="button"
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
                    type="button"
                    onClick={() => setStep("payment")}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:border-white/25 cursor-pointer"
                  >
                    <span>Change Payment Method</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/70 transition-all hover:text-white cursor-pointer"
                  >
                    <span>Edit Details</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
