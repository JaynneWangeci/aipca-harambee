"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Smartphone, Building2, Loader2 } from "lucide-react";

const AMOUNTS = [500, 1000, 2500, 5000, 10000];
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 60000;

type Status = "idle" | "processing" | "success" | "error";
type Method = "mpesa" | "bank";

export default function DonationForm() {
  const [amount, setAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<Method>("mpesa");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const pollDonationStatus = useCallback(
    (checkoutRequestId: string) => {
      const startTime = Date.now();

      pollTimerRef.current = setInterval(async () => {
        if (Date.now() - startTime > POLL_TIMEOUT) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStatus("error");
          setErrorMsg("The payment is taking longer than expected. Please check your M-Pesa messages for a confirmation.");
          return;
        }

        try {
          const res = await fetch(
            `/api/donations/status?checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`,
          );
          const data = await res.json();

          if (data.status === "completed") {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setStatus("success");
          } else if (data.status === "failed") {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setStatus("error");
            setErrorMsg("The payment was declined. Please try again.");
          }
        } catch {
          // Continue polling
        }
      }, POLL_INTERVAL);
    },
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;
    setStatus("processing");
    setErrorMsg("");

    try {
      if (method === "mpesa") {
        const res = await fetch("/api/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            phone,
            donor_name: name || undefined,
            message: message || undefined,
          }),
        });

        const data = await res.json();

        if (data.success && data.checkoutRequestId) {
          pollDonationStatus(data.checkoutRequestId);
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Failed to initiate payment");
        }
      } else {
        const res = await fetch("/api/equity/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            donor_name: name || undefined,
            message: message || undefined,
          }),
        });

        const data = await res.json();

        if (data.success && data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Failed to initiate payment");
        }
      }
    } catch {
      setStatus("error");
      setErrorMsg("A network error occurred. Please try again.");
    }
  }

  if (status === "success") {
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
          Your gift of KES {finalAmount?.toLocaleString()} has been received.
          May God bless you abundantly for sowing into His house.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setName("");
            setPhone("");
            setMessage("");
          }}
          className="mt-6 text-sm underline text-gold hover:text-cream transition-colors"
        >
          Give again
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-maroon/10 p-6 sm:p-8 space-y-6"
    >
      <div>
        <h3 className="font-display text-2xl text-maroon mb-1">Give toward the fund</h3>
        <p className="text-sm text-ink/60">Every gift, of any size, builds something lasting.</p>
      </div>

      {/* Amount chips */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-ink/50 mb-3 font-mono">
          Choose an amount (KES)
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {AMOUNTS.map((amt) => (
            <motion.button
              key={amt}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setAmount(amt);
                setCustomAmount("");
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
              setCustomAmount(e.target.value);
              setAmount(null);
            }}
            className={`py-3 px-3 rounded-xl text-sm font-semibold font-mono border-2 bg-cream text-maroon placeholder:text-maroon/40 focus:outline-none transition-colors ${
              customAmount ? "border-maroon" : "border-maroon/15"
            }`}
          />
        </div>
      </div>

      {/* Name + phone */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mary Wanjiku"
            className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm"
          />
        </div>

        {/* Payment method toggle */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
            Payment method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod("mpesa")}
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
              onClick={() => setMethod("bank")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                method === "bank"
                  ? "bg-maroon text-cream border-maroon"
                  : "bg-cream text-maroon border-maroon/15 hover:border-maroon/40"
              }`}
            >
              <Building2 size={16} /> Bank / Card
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {method === "mpesa" ? (
            <motion.div
              key="mpesa"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
                M-Pesa phone number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm font-mono"
              />
              <p className="mt-1.5 text-xs text-ink/40">
                You&apos;ll receive an STK prompt on your phone to complete payment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="bank"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-ink/60 bg-terracotta-tint rounded-xl p-4"
            >
              You&apos;ll be redirected to Equity&apos;s secure payment page to complete
              this gift via bank transfer or card.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optional message */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
          Message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="With thanksgiving for..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm resize-none"
        />
      </div>

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm text-center bg-red-50 rounded-xl p-3"
        >
          {errorMsg}
        </motion.p>
      )}

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        disabled={status === "processing" || !finalAmount}
        className="w-full py-4 rounded-xl bg-gold text-maroon font-display font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
      >
        {status === "processing" ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {method === "mpesa" ? "Sending prompt to your phone…" : "Redirecting…"}
          </>
        ) : (
          `Give KES ${finalAmount ? finalAmount.toLocaleString() : "0"}`
        )}
      </motion.button>
    </form>
  );
}
