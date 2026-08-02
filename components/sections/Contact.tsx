"use client";

import { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import ContactSuccessModal from "@/components/effects/ContactSuccessModal";

interface FormState {
  name: string;
  email: string;
  subject: string;
  company: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  company: "",
  budget: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [buttonShake, setButtonShake] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Field DOM references for auto-focusing the first invalid field
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Strict Validation Rules
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    const trimmed = value.trim();

    switch (field) {
      case "name": {
        if (!trimmed) return "Full Name is required.";
        if (trimmed.length < 2 || trimmed.length > 60) {
          return "Please enter a valid name (2-60 characters).";
        }
        const nameRegex = /^[a-zA-Z\s'-]{2,60}$/;
        const hasLetters = /[a-zA-Z].*[a-zA-Z]/.test(trimmed);
        if (!nameRegex.test(trimmed) || !hasLetters) {
          return "Name can only contain letters and standard characters.";
        }
        return undefined;
      }

      case "email": {
        if (!trimmed) return "Please enter your email address.";
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address.";
        }
        return undefined;
      }

      case "company": {
        if (!trimmed) return "Company Name is required.";
        if (trimmed.length < 2 || trimmed.length > 100) {
          return "Please enter a valid company name (2-100 characters).";
        }
        const hasLetters = /[a-zA-Z]/.test(trimmed);
        if (!hasLetters) {
          return "Company name must contain valid letters.";
        }
        return undefined;
      }

      case "subject": {
        if (!trimmed) return "Subject is required.";
        if (trimmed.length < 3) return "Subject must be at least 3 characters.";
        return undefined;
      }

      case "message": {
        if (!trimmed) return "Message cannot be empty.";
        if (trimmed.length < 20) {
          return "Message must be at least 20 characters.";
        }
        if (trimmed.length > 1000) {
          return "Message cannot exceed 1000 characters.";
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const validateAll = (): { isValid: boolean; newErrors: FormErrors } => {
    const newErrors: FormErrors = {};
    const nameErr = validateField("name", form.name);
    const emailErr = validateField("email", form.email);
    const companyErr = validateField("company", form.company);
    const subjectErr = validateField("subject", form.subject);
    const messageErr = validateField("message", form.message);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (companyErr) newErrors.company = companyErr;
    if (subjectErr) newErrors.subject = subjectErr;
    if (messageErr) newErrors.message = messageErr;

    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, newErrors };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof FormState, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    // Touch all fields to reveal validation status
    setTouched({
      name: true,
      email: true,
      company: true,
      subject: true,
      message: true,
    });

    const { isValid, newErrors } = validateAll();
    setErrors(newErrors);

    if (!isValid) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);

      if (newErrors.name && nameRef.current) {
        nameRef.current.focus();
        nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
        emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.company && companyRef.current) {
        companyRef.current.focus();
        companyRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.subject && subjectRef.current) {
        subjectRef.current.focus();
        subjectRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.message && messageRef.current) {
        messageRef.current.focus();
        messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      showToast("error", "Please complete all required fields.");
      return;
    }

    // Submit procedure: 1.4s sending phase -> open success modal & set isSuccess state
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setIsModalOpen(true);

      // Reset form fields & validation completely
      setForm(INITIAL_FORM);
      setErrors({});
      setTouched({});

      // Reset isSuccess state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 1400);
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      {/* Centered Success Modal */}
      <ContactSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 right-4 z-[9999] sm:right-8"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-2xl text-sm font-medium",
                toast.type === "error"
                  ? "border-red-500/30 bg-navy-950/90 text-red-300 shadow-red-950/40"
                  : "border-emerald-500/30 bg-navy-950/90 text-emerald-300 shadow-emerald-950/40"
              )}
            >
              {toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="ml-2 text-white/40 hover:text-white"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something great"
          description="Tell us about your project and we'll get back within one business day. No pressure, no jargon — just a friendly conversation."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          {/* Form */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 bg-white/[0.035] backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.65)] p-8 sm:p-10">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.32),inset_0_-1px_0_0_rgba(255,255,255,0.1)]" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-electric-500/15 blur-3xl" />
              <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="group relative flex flex-col">
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={nameRef}
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="[Full name]"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300",
                          touched.name && errors.name
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : touched.name && !errors.name && form.name
                            ? "border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                            : "border-white/10 hover:border-white/20 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                        )}
                      />
                      {touched.name && !errors.name && form.name && (
                        <CheckCircle2 className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    {touched.name && errors.name && (
                      <span id="name-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="group relative flex flex-col">
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={emailRef}
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="[you@example.com]"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300",
                          touched.email && errors.email
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : touched.email && !errors.email && form.email
                            ? "border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                            : "border-white/10 hover:border-white/20 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                        )}
                      />
                      {touched.email && !errors.email && form.email && (
                        <CheckCircle2 className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <span id="email-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="group relative flex flex-col">
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={subjectRef}
                        id="contact-subject"
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="[Website Redesign, Consultation, etc.]"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300",
                          touched.subject && errors.subject
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : touched.subject && !errors.subject && form.subject
                            ? "border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                            : "border-white/10 hover:border-white/20 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                        )}
                      />
                      {touched.subject && !errors.subject && form.subject && (
                        <CheckCircle2 className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    {touched.subject && errors.subject && (
                      <span id="subject-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Company Name (Required) */}
                  <div className="group relative flex flex-col">
                    <label
                      htmlFor="contact-company"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={companyRef}
                        id="contact-company"
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="[Business name]"
                        aria-invalid={!!errors.company}
                        aria-describedby={errors.company ? "company-error" : undefined}
                        className={cn(
                          "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300",
                          touched.company && errors.company
                            ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                            : touched.company && !errors.company && form.company
                            ? "border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                            : "border-white/10 hover:border-white/20 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                        )}
                      />
                      {touched.company && !errors.company && form.company && (
                        <CheckCircle2 className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    {touched.company && errors.company && (
                      <span id="company-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.company}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="group relative flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium uppercase tracking-wider text-white/60"
                    >
                      Message <span className="text-red-400">*</span>
                    </label>
                    {/* Live Character Counter */}
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        form.message.length > 1000
                          ? "text-red-400 font-bold"
                          : form.message.length < 20 && touched.message
                          ? "text-red-400"
                          : "text-white/40"
                      )}
                    >
                      {form.message.length} / 1000
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="[Tell us about your goals, timeline and what you have in mind…]"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      className={cn(
                        "w-full resize-none rounded-xl border bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-300",
                        touched.message && errors.message
                          ? "border-red-500/80 bg-red-500/5 ring-1 ring-red-500/30"
                          : touched.message && !errors.message && form.message
                          ? "border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                          : "border-white/10 hover:border-white/20 focus:border-electric-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-electric-500/20"
                      )}
                    />
                  </div>
                  {touched.message && errors.message && (
                    <span id="message-error" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  animate={buttonShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.45 }}
                  className={cn(
                    "group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 shadow-lg",
                    isSuccess
                      ? "bg-emerald-500 text-white shadow-emerald-500/30"
                      : isSubmitting
                      ? "bg-white/20 text-white cursor-not-allowed"
                      : "text-white"
                  )}
                >
                  {!isSuccess && !isSubmitting && (
                    <span className="absolute inset-0 bg-gradient-to-r from-electric-500 via-purple-500 to-cyan-500 bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0]" />
                  )}

                  <span className="relative flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Sending...
                      </>
                    ) : isSuccess ? (
                      <>
                        <Check className="h-4 w-4 text-white" />
                        Message Sent
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </Reveal>

          {/* Details */}
          <Reveal direction="left">
            <div className="flex h-full flex-col gap-4">
              {[
                { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
                { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone}` },
                { icon: MapPin, label: "Studio", value: site.address },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-400 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500/20 to-purple-500/20 ring-1 ring-white/10">
                    <item.icon className="h-5 w-5 text-cyan-300" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/40">
                      {item.label}
                    </div>
                    <div className="text-sm text-white/80">{item.value}</div>
                  </div>
                </a>
              ))}

              {/* Business hours */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                  <Clock className="h-4 w-4" /> Business hours
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {site.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white/60">{h.day}</span>
                      <span className="text-white/80">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Studio location frame */}
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-navy-800/40">
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 to-purple-500/10" />
                <div className="relative flex h-full min-h-[160px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute h-10 w-10 animate-pulse-ring rounded-full bg-cyan-500/40" />
                      <MapPin className="relative h-6 w-6 text-cyan-300" />
                    </span>
                    <span className="text-xs text-white/40">{site.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
