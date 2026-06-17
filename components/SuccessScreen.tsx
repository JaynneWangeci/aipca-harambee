"use client";

import { motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";

interface SuccessScreenProps {
  amount: number;
  name: string;
  receiptNumber: string;
  onReset: () => void;
}

export default function SuccessScreen({
  amount,
  name,
  receiptNumber,
  onReset,
}: SuccessScreenProps) {
  const shareText = `I just gave KES ${amount.toLocaleString()} to AIPCA Bahati Cathedral Development Fund! Receipt: ${receiptNumber}. Give here: ${typeof window !== "undefined" ? window.location.origin + "/fund/development-fund" : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-maroon text-cream p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="mx-auto mb-4 w-14 h-14 rounded-full bg-gold flex items-center justify-center"
      >
        <Check className="text-maroon" size={28} />
      </motion.div>
      <h3 className="font-display text-2xl mb-2">Asante sana, {name || "friend"}!</h3>
      <p className="text-cream/80 text-sm max-w-xs mx-auto">
        Your gift of KES {amount.toLocaleString()} has been received.
        May God bless you abundantly for sowing into His house.
      </p>
      {receiptNumber && (
        <p className="text-cream/50 text-[10px] font-mono mt-2">
          Receipt: {receiptNumber}
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={() => {
            window.open(
              `https://wa.me/?text=${encodeURIComponent(shareText)}`,
              "_blank",
            );
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Share2 size={14} /> Share on WhatsApp
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream/20 text-cream text-sm hover:bg-cream/30 transition-colors"
        >
          Give again
        </button>
      </div>
    </motion.div>
  );
}
