"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import MemberDropdown from "@/components/MemberDropdown";

export default function PledgeForm() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honoredMemberId, setHonoredMemberId] = useState("");
  const [honoredMemberName, setHonoredMemberName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          donor_name: name || undefined,
          phone,
          email: email || undefined,
          message: message || undefined,
          honored_member_id: honoredMemberId || undefined,
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit pledge");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-maroon text-cream p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto mb-4 w-14 h-14 rounded-full bg-gold flex items-center justify-center"
        >
          <Check className="text-maroon" size={28} />
        </motion.div>
        <h3 className="font-display text-2xl mb-2">Pledge received!</h3>
        <p className="text-cream/80 text-sm max-w-xs mx-auto">
          Thank you, {name || "friend"}! Your pledge of KES {Number(amount).toLocaleString()} has been recorded.
          You can send your contribution via M-Pesa Paybill <strong>247247</strong> Account <strong>BAHATI</strong>
          {" "}or Equity Bank <strong>1840291670724</strong>.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setAmount("");
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
            setHonoredMemberId("");
          }}
          className="mt-6 text-sm underline text-gold hover:text-cream transition-colors"
        >
          Make another pledge
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-maroon/10 p-6 sm:p-8 space-y-4">
      <h3 className="font-display text-xl text-maroon">Make a Pledge</h3>
      <p className="text-xs text-ink/50 -mt-2">
        Promise an amount now, send it later via M-Pesa or bank transfer.
      </p>

      <div>
        <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
          Pledge amount (KES)
        </label>
        <input
          type="number"
          min={1}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
          className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm font-mono"
        />
      </div>

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

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XX XXX XXX"
            className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm"
          />
        </div>
      </div>

      <MemberDropdown
        value={honoredMemberId}
        onChange={(id, _name) => {
          setHonoredMemberId(id);
          setHonoredMemberName(_name);
        }}
      />

      <div>
        <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
          Message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="For the sanctuary fund…"
          rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream focus:border-maroon focus:outline-none text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center bg-red-50 rounded-xl p-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 rounded-xl bg-maroon text-cream font-display font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity hover:bg-maroon/90"
      >
        {submitting ? <Loader2 className="animate-spin" size={20} /> : null}
        {submitting ? "Submitting…" : `Pledge KES ${Number(amount || 0).toLocaleString()}`}
      </button>
    </form>
  );
}
