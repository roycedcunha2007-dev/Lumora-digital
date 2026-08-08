"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { pricing } from "@/lib/site";

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  numericPrice?: number;
  usdPrice?: string;
  cadence: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
}

interface CheckoutContextType {
  isOpen: boolean;
  selectedPlan: PlanItem;
  openCheckout: (plan?: Partial<PlanItem> | string) => void;
  closeCheckout: () => void;
  selectPlan: (planId: string) => void;
  plans: PlanItem[];
}

const defaultPlan = pricing.find((p) => p.highlight) || pricing[1] || pricing[0];

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem>(defaultPlan);

  const selectPlan = useCallback((planId: string) => {
    const found = pricing.find((p) => p.id === planId || p.name.toLowerCase() === planId.toLowerCase());
    if (found) {
      setSelectedPlan(found);
    }
  }, []);

  const openCheckout = useCallback(
    (plan?: Partial<PlanItem> | string) => {
      if (typeof plan === "string") {
        const found = pricing.find(
          (p) => p.id === plan || p.name.toLowerCase() === plan.toLowerCase()
        );
        if (found) setSelectedPlan(found);
      } else if (plan && plan.id) {
        const found = pricing.find((p) => p.id === plan.id);
        if (found) {
          setSelectedPlan({ ...found, ...plan });
        } else {
          setSelectedPlan({ ...defaultPlan, ...plan });
        }
      }
      setIsOpen(true);
    },
    []
  );

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        isOpen,
        selectedPlan,
        openCheckout,
        closeCheckout,
        selectPlan,
        plans: pricing,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
