"use client";

import { motion } from "framer-motion";
import { Smartphone, Building2 } from "lucide-react";

type Method = "mpesa" | "bank";

interface PaymentMethodSelectorProps {
  method: Method;
  onChange: (m: Method) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
}

export default function PaymentMethodSelector({
  method,
  onChange,
  phone,
  onPhoneChange,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
        Payment method
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange("mpesa")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
            method === "mpesa"
              ? "bg-maroon text-cream border-maroon"
              : "bg-cream text-maroon border-maroon/15 hover:border-maroon/40"
          }`}
        >
          <Smartphone size={16} /> M-Pesa
        </button>
        <button
          type="button"
          onClick={() => onChange("bank")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
            method === "bank"
              ? "bg-maroon text-cream border-maroon"
              : "bg-cream text-maroon border-maroon/15 hover:border-maroon/40"
          }`}
        >
          <Building2 size={16} /> Bank / Card
        </button>
      </div>

      <motion.div
        key={method}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="overflow-hidden"
      >
        {method === "mpesa" ? (
          <div className="mt-3">
            <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
              M-Pesa phone number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm font-mono"
            />
            <p className="mt-1.5 text-xs text-ink/40">
              You&apos;ll receive an STK prompt on your phone to complete payment.
            </p>
          </div>
        ) : (
          <div className="mt-3 text-sm text-ink/60 bg-terracotta-tint rounded-xl p-4">
            You&apos;ll be redirected to Equity&apos;s secure payment page to complete
            this gift via bank transfer or card.
          </div>
        )}
      </motion.div>
    </div>
  );
}
