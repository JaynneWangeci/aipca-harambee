"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import type { CommitteeMember } from "@/types";

interface MemberDropdownProps {
  value: string;
  onChange: (memberId: string, memberName: string) => void;
}

export default function MemberDropdown({ value, onChange }: MemberDropdownProps) {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/committee")
      .then((r) => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  const selected = members.find((m) => m.id === value);

  return (
    <div className="relative">
      <label className="block text-xs uppercase tracking-wider text-ink/50 mb-1.5 font-mono">
        Give in honor of (optional)
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-xl border-2 border-maroon/15 bg-cream text-sm text-left flex items-center justify-between gap-2 focus:border-maroon focus:outline-none transition-colors"
      >
        <span className={selected ? "text-ink" : "text-ink/40"}>
          {selected ? `${selected.name} — ${selected.role}` : "Select a committee member…"}
        </span>
        <ChevronDown size={16} className="text-ink/30 shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-maroon/15 shadow-lg max-h-56 overflow-y-auto custom-scroll">
            <button
              type="button"
              onClick={() => {
                onChange("", "");
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-ink/50 hover:bg-cream text-left flex items-center gap-2"
            >
              <User size={14} /> None
            </button>
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id, m.name);
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm text-ink hover:bg-cream text-left border-t border-maroon/5"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-ink/40 text-[11px] ml-2">{m.role}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
