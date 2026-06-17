"use client";

import { motion } from "framer-motion";

const PRESETS = [500, 1000, 2500, 5000, 10000];

interface AmountSelectorProps {
  amount: number | null;
  customAmount: string;
  onSelect: (amount: number) => void;
  onCustomChange: (value: string) => void;
}

export default function AmountSelector({
  amount,
  customAmount,
  onSelect,
  onCustomChange,
}: AmountSelectorProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-ink/50 mb-3 font-mono">
        Choose an amount (KES)
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {PRESETS.map((amt) => (
          <motion.button
            key={amt}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              onSelect(amt);
              onCustomChange("");
            }}
            className={`py-3 rounded-xl text-sm font-semibold font-mono border-2 transition-colors ${
              amount === amt && !customAmount
                ? "bg-maroon text-cream border-maroon"
                : "bg-cream text-maroon border-maroon/15 hover:border-maroon/40"
            }`}
          >
            {amt.toLocaleString()}
          </motion.button>
        ))}
        <input
          type="number"
          min={1}
          placeholder="Custom"
          value={customAmount}
          onChange={(e) => {
            onCustomChange(e.target.value);
            onSelect(0);
          }}
          className={`py-3 px-3 rounded-xl text-sm font-semibold font-mono border-2 bg-cream text-maroon placeholder:text-maroon/40 focus:outline-none transition-colors ${
            customAmount ? "border-maroon" : "border-maroon/15"
          }`}
        />
      </div>
    </div>
  );
}
