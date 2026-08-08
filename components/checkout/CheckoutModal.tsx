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
  Zap,
} from "lucide-react";
import { useCheckout } from "./CheckoutContext";
import { cn } from "@/lib/utils";

type PaymentMethodType = "card" | "upi" | "gpay" | "paypal" | "applepay";

// Test cards for quick frontend filling
const TEST_CARDS = {
  visa: {
    number: "4242 4242 4242 4242",
    holder: "Alex Rivera",
    expiry: "12/28",
    cvv: "892",
  },
  mastercard: {
    number: "5555 5555 5555 4444",
    holder: "Jordan Lee",
    expiry: "09/27",
    cvv: "321",
  },
};

// Subtle Confetti Burst for Success Screen
const SUCCESS_PARTICLES = Array.from({ length: 30 }).map((_, i) => {
  const angle = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
  const distance = 80 + Math.random() * 90;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 15,
    scale: Math.random() * 0.6 + 0.4,
    color: i % 3 === 0 ? "#FFFFFF" : i % 3 === 1 ? "#93C5FD" : "#3B82F6",
  };
});

export default function CheckoutModal() {
  const { isOpen, closeCheckout, selectedPlan, selectPlan, plans } = useCheckout();

  const [method, setMethod] = useState<PaymentMethodType>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [simulateError, setSimulateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [buttonShake, setButtonShake] = useState(false);

  // Form Fields
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [upiId, setUpiId] = useState("");

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Countdown timer for QR code
  const [qrCountdown, setQrCountdown] = useState(300); // 5 mins

  // Magnetic button coordinates
  const payBtnRef = useRef<HTMLButtonElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsSuccess(false);
      setIsProcessing(false);
      setErrorMessage(null);
      setErrors({});
      setTouched({});
      setOrderRef(`DEMO-LMR-${Math.floor(100000 + Math.random() * 900000)}`);
      setQrCountdown(300);

      // Default demo billing email if empty
      setBillingEmail((prev) => prev || "client@example.com");
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // QR countdown timer
  useEffect(() => {
    if (!isOpen || method !== "upi" || isSuccess) return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, method, isSuccess]);

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
    if (touched.cardNumber) {
      if (digits.length < 16) {
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

  const handleExpiryChange = (val: string) => {
    let digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    setCardExpiry(digits);
    if (touched.cardExpiry) {
      if (digits.length < 5) {
        setErrors((p) => ({ ...p, cardExpiry: "Expiry date is required (MM/YY)." }));
      } else {
        setErrors((p) => {
          const next = { ...p };
          delete next.cardExpiry;
          return next;
        });
      }
    }
  };

  const handleCvvChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    setCardCvv(digits);
    if (touched.cardCvv) {
      if (digits.length < 3) {
        setErrors((p) => ({ ...p, cardCvv: "CVV is required (3 or 4 digits)." }));
      } else {
        setErrors((p) => {
          const next = { ...p };
          delete next.cardCvv;
          return next;
        });
      }
    }
  };

  // Quick fill test card
  const fillTestCard = (type: "visa" | "mastercard") => {
    const card = TEST_CARDS[type];
    setCardNumber(card.number);
    setCardHolder(card.holder);
    setCardExpiry(card.expiry);
    setCardCvv(card.cvv);
    setErrors({});
    setErrorMessage(null);
  };

  // Detect card brand
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^(60|65|64[4-9]|622)/.test(clean)) return "RUPAY";
    return "CARD";
  };

  // Validation
  const validateCurrentMethod = () => {
    const newErrors: Record<string, string> = {};

    if (!billingEmail.trim()) {
      newErrors.billingEmail = "Billing email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail.trim())) {
      newErrors.billingEmail = "Please enter a valid email address.";
    }

    if (method === "card") {
      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Cardholder name is required.";
      } else if (cardHolder.trim().length < 3) {
        newErrors.cardHolder = "Cardholder name must be at least 3 characters.";
      }

      const cleanNum = cardNumber.replace(/\s/g, "");
      if (!cleanNum) {
        newErrors.cardNumber = "Card number is required.";
      } else if (cleanNum.length < 16) {
        newErrors.cardNumber = "Enter a valid 16-digit card number.";
      }

      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = "Expiry date is required.";
      } else if (cardExpiry.length < 5) {
        newErrors.cardExpiry = "Enter expiry in MM/YY format.";
      }

      if (!cardCvv.trim()) {
        newErrors.cardCvv = "CVV is required.";
      } else if (cardCvv.length < 3) {
        newErrors.cardCvv = "CVV must be 3 or 4 digits.";
      }
    }

    if (method === "upi") {
      if (!upiId.trim()) {
        newErrors.upiId = "Please enter a valid UPI ID (e.g. name@bank).";
      } else if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
        newErrors.upiId = "Invalid UPI ID format (example: yourname@okaxis).";
      }
    }

    return newErrors;
  };

  // Submit Handler
  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || isSuccess) return;

    setTouched({
      cardHolder: true,
      cardNumber: true,
      cardExpiry: true,
      cardCvv: true,
      billingEmail: true,
      upiId: true,
    });

    const validationErrors = validateCurrentMethod();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);
      setErrorMessage("Please complete all required demo fields.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    // Simulated Processing Flow
    setProcessingStep("Validating demo credentials...");

    setTimeout(() => {
      setProcessingStep("Connecting to sandbox simulator...");

      setTimeout(() => {
        if (simulateError) {
          setIsProcessing(false);
          setProcessingStep("");
          setButtonShake(true);
          setTimeout(() => setButtonShake(false), 500);
          setErrorMessage("Simulated Bank Decline: Transaction declined by sandbox simulator.");
          return;
        }

        setProcessingStep("Authorizing demo payment...");

        setTimeout(() => {
          setIsProcessing(false);
          setProcessingStep("");
          setIsSuccess(true);
        }, 800);
      }, 900);
    }, 700);
  };

  // Magnetic button hover
  const handleButtonMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = payBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    setBtnPos({ x, y });
  };
  const resetBtnPos = () => setBtnPos({ x: 0, y: 0 });

  // Download Demo Receipt
  const handleDownloadReceipt = () => {
    const text = `================================================
LUMORA DIGITAL — DEMO CHECKOUT RECEIPT
================================================
Notice: This is a frontend demonstration only.
No real financial transaction occurred.
------------------------------------------------
Order Reference : ${orderRef}
Date & Time     : ${new Date().toLocaleString()}
Plan Selected   : ${selectedPlan.name} Plan
Package Cadence : ${selectedPlan.cadence}
------------------------------------------------
Subtotal        : ${selectedPlan.price}
Taxes & Fees    : ₹0.00 (Demo Simulation)
Total Paid      : ${selectedPlan.price} (DEMO)
Payment Method  : ${method.toUpperCase()}
Status          : SUCCESS (SANDBOX SIMULATION)
------------------------------------------------
Client Email    : ${billingEmail}
Customer Care   : business@lumoradigital.com
================================================
Thank you for testing the Lumora Digital experience!
================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${orderRef}-Receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Deep Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={closeCheckout}
          className="fixed inset-0 bg-black/80 backdrop-blur-[20px]"
        />

        {/* Central Luxury Glassmorphism Checkout Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/[0.12] bg-[#08080c]/95 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-3xl"
        >
          {/* Subtle Ambient Electric Blue Top Rim Glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(255,255,255,0.03)]" />

          {/* Top Bar: Demo Badge, Back & Close Buttons */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] px-6 py-4.5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={closeCheckout}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Studio</span>
              </button>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-semibold text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                DEMO SANDBOX CHECKOUT
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

          {/* MAIN CONTENT: Conditional between Checkout Form and Success View */}
          {!isSuccess ? (
            <div className="grid gap-0 lg:grid-cols-[0.44fr_0.56fr]">
              {/* LEFT COLUMN: Order Summary & Plan Selector */}
              <div className="flex flex-col justify-between border-b border-white/[0.08] bg-white/[0.015] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                      Order Summary
                    </span>
                    <span className="text-xs font-mono text-blue-400">
                      Ref: {orderRef}
                    </span>
                  </div>

                  {/* Plan Switcher Pills */}
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

                  {/* Selected Plan Details Card */}
                  <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#07080c]/60 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {selectedPlan.name} Package
                        </h3>
                        <p className="mt-1 text-xs text-white/55">
                          {selectedPlan.tagline}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-2xl font-bold text-white">
                          {selectedPlan.price}
                        </span>
                        <span className="block text-[10px] text-white/40">
                          {selectedPlan.cadence}
                        </span>
                      </div>
                    </div>

                    <div className="my-4 h-px w-full bg-white/[0.06]" />

                    {/* Features checklist */}
                    <ul className="space-y-2">
                      {selectedPlan.features.slice(0, 5).map((f) => (
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
                  <div className="mt-6 space-y-2.5 rounded-2xl border border-white/[0.06] bg-black/20 p-4.5 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Package Subtotal</span>
                      <span className="text-white/90">{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Demo Sandbox Surcharge</span>
                      <span className="text-emerald-400">₹0.00 (Waived)</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Production Deployment</span>
                      <span className="text-white/90">Included</span>
                    </div>
                    <div className="h-px w-full bg-white/[0.08]" />
                    <div className="flex items-center justify-between text-sm font-bold text-white">
                      <span>Total Demo Due</span>
                      <span className="font-display text-base text-blue-400">
                        {selectedPlan.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security & Disclaimer Footer */}
                <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11px] text-white/50">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>
                    Frontend Sandbox Simulation · Zero real payment data stored or processed.
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Payment Method Selector & Interactive Form */}
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                      Select Payment Method
                    </span>
                    <span className="text-[11px] text-white/40">
                      Simulated Channels
                    </span>
                  </div>

                  {/* Method Tabs Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {[
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "upi", label: "UPI / QR", icon: QrCode },
                      { id: "gpay", label: "GPay", icon: Smartphone },
                      { id: "paypal", label: "PayPal", icon: Lock },
                      { id: "applepay", label: "Apple Pay", icon: Zap },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = method === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setMethod(m.id as PaymentMethodType);
                            setErrorMessage(null);
                            setErrors({});
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center transition-all cursor-pointer",
                            isSelected
                              ? "border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                              : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-[11px] font-medium">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Method Form Body */}
                  <form onSubmit={handlePaySubmit} noValidate className="mt-6 space-y-4">
                    {/* Common Field: Billing Email */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-white/70">
                          Billing Email <span className="text-blue-400">*</span>
                        </label>
                        {errors.billingEmail && (
                          <span className="text-[11px] text-red-400">{errors.billingEmail}</span>
                        )}
                      </div>
                      <input
                        type="email"
                        value={billingEmail}
                        onChange={(e) => {
                          setBillingEmail(e.target.value);
                          if (errors.billingEmail) {
                            setErrors((p) => {
                              const next = { ...p };
                              delete next.billingEmail;
                              return next;
                            });
                          }
                        }}
                        placeholder="[you@example.com]"
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                          errors.billingEmail
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                        )}
                      />
                    </div>

                    {/* METHOD 1: CARD PAYMENT */}
                    {method === "card" && (
                      <div className="space-y-4 pt-1">
                        {/* Test Autofill Quick Buttons */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Quick Demo Fill:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => fillTestCard("visa")}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer"
                            >
                              Test Visa
                            </button>
                            <button
                              type="button"
                              onClick={() => fillTestCard("mastercard")}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer"
                            >
                              Test Mastercard
                            </button>
                          </div>
                        </div>

                        {/* Cardholder Name */}
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <label className="text-xs font-medium text-white/70">
                              Cardholder Name <span className="text-blue-400">*</span>
                            </label>
                            {errors.cardHolder && (
                              <span className="text-[11px] text-red-400">{errors.cardHolder}</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => {
                              setCardHolder(e.target.value);
                              if (errors.cardHolder) {
                                setErrors((p) => {
                                  const next = { ...p };
                                  delete next.cardHolder;
                                  return next;
                                });
                              }
                            }}
                            placeholder="[Name on Card]"
                            className={cn(
                              "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all",
                              errors.cardHolder
                                ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
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
                              value={cardNumber}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              placeholder="[4242 4242 4242 4242]"
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-16 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                                errors.cardNumber
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
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
                              {errors.cardExpiry && (
                                <span className="text-[10px] text-red-400">{errors.cardExpiry}</span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              placeholder="MM/YY"
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                                errors.cardExpiry
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <label className="text-xs font-medium text-white/70">
                                CVV / CVC <span className="text-blue-400">*</span>
                              </label>
                              {errors.cardCvv && (
                                <span className="text-[10px] text-red-400">{errors.cardCvv}</span>
                              )}
                            </div>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => handleCvvChange(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-sm font-mono text-white placeholder-white/25 outline-none transition-all",
                                errors.cardCvv
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 2: UPI / QR PAYMENT */}
                    {method === "upi" && (
                      <div className="space-y-4 pt-1">
                        {/* Simulated Dynamic QR Code Card */}
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-black/40 p-5 text-center">
                          <div className="relative flex h-36 w-36 items-center justify-center rounded-xl border border-white/15 bg-white p-2.5 shadow-xl">
                            {/* Dynamic SVG QR Visual */}
                            <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
                              <rect width="100" height="100" fill="white" />
                              {/* Finder Patterns */}
                              <rect x="6" y="6" width="26" height="26" rx="4" fill="black" />
                              <rect x="10" y="10" width="18" height="18" rx="2" fill="white" />
                              <rect x="14" y="14" width="10" height="10" fill="#2563eb" />

                              <rect x="68" y="6" width="26" height="26" rx="4" fill="black" />
                              <rect x="72" y="10" width="18" height="18" rx="2" fill="white" />
                              <rect x="76" y="14" width="10" height="10" fill="#2563eb" />

                              <rect x="6" y="68" width="26" height="26" rx="4" fill="black" />
                              <rect x="10" y="72" width="18" height="18" rx="2" fill="white" />
                              <rect x="14" y="76" width="10" height="10" fill="#2563eb" />

                              {/* Matrix Pattern Dots */}
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

                            {/* Center Lumora logo stamp */}
                            <div className="absolute flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-display text-xs font-bold text-white shadow-md">
                              L
                            </div>

                            {/* Traveling scan laser */}
                            <motion.div
                              animate={{ y: [-45, 45, -45] }}
                              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                              className="pointer-events-none absolute inset-x-2 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                            />
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-white/70">
                            <span>Scan QR with GPay / PhonePe / Paytm</span>
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
                              Or Enter UPI ID / VPA <span className="text-blue-400">*</span>
                            </label>
                            {errors.upiId && (
                              <span className="text-[11px] text-red-400">{errors.upiId}</span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                if (errors.upiId) {
                                  setErrors((p) => {
                                    const next = { ...p };
                                    delete next.upiId;
                                    return next;
                                  });
                                }
                              }}
                              placeholder="[yourname@okaxis]"
                              className={cn(
                                "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-20 text-sm text-white placeholder-white/25 outline-none transition-all",
                                errors.upiId
                                  ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                                  : "border-white/[0.08] focus:border-blue-400 focus:bg-white/[0.04] focus:ring-2 focus:ring-blue-500/20"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setUpiId("lumoraclient@okaxis");
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2000);
                              }}
                              className="absolute right-2 top-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                              {copiedUpi ? "Filled!" : "Use Demo ID"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 3: GOOGLE PAY */}
                    {method === "gpay" && (
                      <div className="space-y-4 pt-1">
                        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-navy-950 font-bold text-xs shadow-md">
                                GPay
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-white">
                                  Google Pay Demo Account
                                </span>
                                <span className="block text-xs text-white/50">
                                  alex.rivera@gmail.com
                                </span>
                              </div>
                            </div>
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                              Linked
                            </span>
                          </div>

                          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70">
                            <div className="flex items-center justify-between">
                              <span className="font-mono">HDFC Bank Premium Debit Card</span>
                              <span className="font-mono text-white/50">•••• 4092</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 4: PAYPAL */}
                    {method === "paypal" && (
                      <div className="space-y-4 pt-1">
                        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0070BA] font-display text-sm font-bold text-white shadow-md">
                                P
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-white">
                                  PayPal Simulated Express
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
                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
                              <span>Pay in 4 (Bi-weekly)</span>
                              <span className="text-white/60">₹3,749 / installment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 5: APPLE PAY */}
                    {method === "applepay" && (
                      <div className="space-y-4 pt-1">
                        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black font-bold text-xs shadow-md">
                                Pay
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-white">
                                  Apple Pay Simulated Sheet
                                </span>
                                <span className="block text-xs text-white/50">
                                  Double-Click Side Button to Pay
                                </span>
                              </div>
                            </div>
                            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                              Face ID Ready
                            </span>
                          </div>

                          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70">
                            <div className="flex items-center justify-between">
                              <span className="font-mono">Apple Card Titanium (Demo)</span>
                              <span className="font-mono text-white/50">•••• 8821</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error simulation toggle for realistic testing */}
                    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-3.5 py-2.5 text-xs text-white/60">
                      <div className="flex items-center gap-2">
                        <Info className="h-3.5 w-3.5 text-blue-400" />
                        <span>Simulate Bank Decline for Testing</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSimulateError((v) => !v)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer",
                          simulateError ? "bg-red-500" : "bg-white/20"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                            simulateError ? "translate-x-4.5" : "translate-x-1"
                          )}
                        />
                      </button>
                    </div>

                    {/* Error Alert Display */}
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-300"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}

                    {/* Liquid Glass Magnetic Pay Button */}
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
                        "group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 cursor-pointer",
                        isProcessing
                          ? "bg-blue-700/80 cursor-wait"
                          : "bg-blue-600 shadow-[0_8px_32px_rgba(59,130,246,0.35)] hover:bg-blue-500 hover:shadow-[0_12px_45px_rgba(59,130,246,0.5)]"
                      )}
                    >
                      {/* Subtle Sheen Sweep */}
                      <span className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-full group-hover:opacity-100" />

                      <span className="relative z-10 flex items-center gap-2">
                        {isProcessing ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>{processingStep || "Processing..."}</span>
                          </>
                        ) : (
                          <>
                            <span>Pay {selectedPlan.price} (Demo Sandbox)</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* SUCCESS EXPERIENCE VIEW */
            <div className="relative p-8 text-center sm:p-12">
              {/* Confetti Particles */}
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
                  transition={{
                    duration: 1.1,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ backgroundColor: p.color }}
                  className="pointer-events-none absolute left-1/2 top-20 h-2 w-2 rounded-full"
                />
              ))}

              {/* Animated Animated SVG Checkmark */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-[0_0_40px_rgba(59,130,246,0.5)]"
                />
                <svg className="relative z-10 h-12 w-12 text-white" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
                  />
                </svg>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="absolute -right-1 -top-1"
                >
                  <Sparkles className="h-5 w-5 text-blue-200 fill-blue-200" />
                </motion.div>
              </div>

              {/* Success Heading */}
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                Payment Successful!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/65"
              >
                Demo transaction completed successfully. Thank you for choosing Lumora Digital for your flagship web build.
              </motion.p>

              {/* Itemized Demo Receipt Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.45 }}
                className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/[0.08] bg-[#07080c]/80 p-5 text-left text-xs text-white/70"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 font-mono">
                  <span className="text-white/40">Reference</span>
                  <span className="font-bold text-blue-400">{orderRef}</span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/50">Plan Purchased</span>
                    <span className="font-medium text-white">{selectedPlan.name} Package</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Amount Paid (Demo)</span>
                    <span className="font-medium text-white">{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Payment Channel</span>
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
                transition={{ delay: 0.65, duration: 0.45 }}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <button
                  onClick={handleDownloadReceipt}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-semibold text-white transition-all hover:border-blue-400/40 hover:bg-white/[0.08] sm:w-auto cursor-pointer"
                >
                  <Download className="h-4 w-4 text-blue-400" />
                  <span>Download Demo Receipt</span>
                </button>

                <button
                  onClick={closeCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 sm:w-auto cursor-pointer"
                >
                  <span>Return to Website</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>

              <p className="mt-5 text-[11px] text-white/40">
                Notice: This is a frontend demonstration sandbox. No actual credit or funds were deducted.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
