"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { site } from "@/lib/site";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setTip(true), 3500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Hi Lumora Digital, I'd like to discuss a project."
  )}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-[8000] flex items-center gap-3"
        >
          <AnimatePresence>
            {tip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden items-center gap-2 rounded-full glass-strong px-4 py-2.5 text-sm text-white shadow-glass sm:flex"
              >
                Chat with us
                <button
                  onClick={() => setTip(false)}
                  aria-label="Dismiss"
                  className="text-white/40 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)]"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/50" />
            <MessageCircle className="relative h-7 w-7 fill-white text-white transition-transform duration-300 group-hover:scale-110" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
