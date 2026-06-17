"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import AmountSelector from "@/components/AmountSelector";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import MemberDropdown from "@/components/MemberDropdown";
import SuccessScreen from "@/components/SuccessScreen";
import type { DonationPollResponse } from "@/types";

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 60000;

type Step = "amount" | "details" | "confirm" | "processing" | "success";
type Method = "mpesa" | "bank";
type Status = "idle" | "error";

export default function DonationForm() {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<Method>("mpesa");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [honoredMemberId, setHonoredMemberId] = useState("");
  const [honoredMemberName, setHonoredMemberName] = useState("");
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const pollDonationStatus = useCallback(
    (checkoutRequestId: string) => {
      const startTime = Date.now();
      pollTimerRef.current = setInterval(async () => {
        if (Date.now() - startTime > POLL_TIMEOUT) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setStatus("error");
          setErrorMsg("The payment is taking longer than expected. Please check your M-Pesa messages.");
          return;
        }
        try {
          const res = await fetch(
            `/api/donations/status?checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`,
          );
          const data: DonationPollResponse = await res.json();
          if (data.status === "completed") {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setReceiptNumber(data.receipt_number || data.mpesa_receipt || "");
            setStep("success");
          } else if (data.status === "failed") {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setStatus("error");
            setErrorMsg("The payment was declined. Please try again.");
          }
        } catch {}
      }, POLL_INTERVAL);
    },
    [],
  );

  async function handleConfirm() {
    if (!finalAmount || finalAmount <= 0) return;
    setStep("processing");
    setStatus("idle");
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
            honored_member_id: honoredMemberId || undefined,
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
            honored_member_id: honoredMemberId || undefined,
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

  function reset() {
    setStep("amount");
    setAmount(1000);
    setCustomAmount("");
    setName("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
    setReceiptNumber("");
    setHonoredMemberId("");
    setHonoredMemberName("");
  }

  if (step === "success") {
    return (
      <SuccessScreen
        amount={finalAmount || 0}
        name={name}
        receiptNumber={receiptNumber}
        onReset={reset}
      />
    );
  }

  const canContinue = finalAmount && finalAmount > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step === "amount") setStep("details");
        else if (step === "details") setStep("confirm");
        else if (step === "confirm") handleConfirm();
      }}
      className="rounded-2xl bg-white border border-maroon/10 p-6 sm:p-8 space-y-6"
    >
      <h3 className="font-display text-2xl text-maroon mb-1">
        {step === "amount" && "Choose your gift"}
        {step === "details" && "Your details"}
        {step === "confirm" && "Confirm your gift"}
        {step === "processing" && "Processing…"}
      </h3>

      <AnimatePresence mode="wait">
        {step === "amount" && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <AmountSelector
              amount={amount}
              customAmount={customAmount}
              onSelect={setAmount}
              onCustomChange={setCustomAmount}
            />
          </motion.div>
        )}

        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
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
            <MemberDropdown
              value={honoredMemberId}
              onChange={(id, memberName) => {
                setHonoredMemberId(id);
                setHonoredMemberName(memberName);
              }}
            />
            <PaymentMethodSelector
              method={method}
              onChange={setMethod}
              phone={phone}
              onPhoneChange={setPhone}
            />
            <div>
              <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="With thanksgiving for…"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm resize-none"
              />
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <div className="bg-cream rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Amount</span>
                <span className="font-mono font-semibold text-maroon">
                  KES {finalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Donor</span>
                <span>{name || "Anonymous"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Method</span>
                <span className="font-medium">{method === "mpesa" ? "M-Pesa" : "Bank / Card"}</span>
              </div>
              {method === "mpesa" && (
                <div className="flex justify-between">
                  <span className="text-ink/60">Phone</span>
                  <span className="font-mono">
                    {phone.replace(/\d(?=\d{4})/g, "*")}
                  </span>
                </div>
              )}
            </div>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm text-center bg-red-50 rounded-xl p-3"
              >
                {errorMsg}
              </motion.p>
            )}
            <p className="text-[11px] text-ink/40 text-center">
              By clicking Confirm, you agree to our terms. No payment data is stored on this website.
            </p>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Loader2 className="animate-spin mx-auto mb-4 text-maroon" size={32} />
            <p className="text-ink/60 text-sm">
              {method === "mpesa"
                ? "Sending STK prompt to your phone…"
                : "Redirecting to secure payment page…"}
            </p>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm mt-4 bg-red-50 rounded-xl p-3"
              >
                {errorMsg}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {step !== "processing" && (
        <div className="flex gap-3">
          {step !== "amount" && (
            <button
              type="button"
              onClick={() => {
                if (step === "details") setStep("amount");
                else if (step === "confirm") setStep("details");
              }}
              className="flex-1 py-3 rounded-xl border-2 border-maroon/15 text-maroon font-medium text-sm flex items-center justify-center gap-1 hover:bg-cream transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button
            type="submit"
            disabled={!canContinue}
            className="flex-1 py-4 rounded-xl bg-gold text-maroon font-display font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
          >
            {step === "amount" && (
              <>
                Continue <ArrowRight size={18} />
              </>
            )}
            {step === "details" && (
              <>
                Review gift <ArrowRight size={18} />
              </>
            )}
            {step === "confirm" && "Confirm & Give"}
          </button>
        </div>
      )}
    </form>
  );
}
