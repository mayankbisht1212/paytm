"use client";

import React, { useState } from "react";
import { X, ArrowUpRight, RotateCw } from "lucide-react";

interface TransferFailedProps {
  /** Amount that failed to send, in rupees (e.g. 12500 or 12500.50) */
  amount: number;
  /** Who the money was headed to */
  recipient?: string;
  /** Reference / transaction id shown on the stub */
  transactionId?: string;
  /** ISO date string or Date; defaults to now */
  timestamp?: string | Date;
  /** Short, plain-language reason for the failure */
  reason?: string;
  /** Called when the person taps "Retry transfer". Return/resolve false to signal failure again. */
  onRetry?: () => void | Promise<void | boolean> | Promise<boolean>;
  /** Called when the person taps "Cancel" */
  onCancel?: () => void;
}

function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export default function TransferFailed({
  amount,
  recipient = "Recipient",
  transactionId = "TXN" + Math.floor(100000000 + Math.random() * 900000000),
  timestamp = new Date(),
  reason = "The bank declined this payment. No money has left your account.",
  onRetry,
  onCancel,
}: TransferFailedProps) {
  const [retrying, setRetrying] = useState(false);
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const handleRetry = async () => {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div
      style={{
        fontFamily:
          "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        background: "#EDF2EC",
      }}
      className="flex min-h-[600px] w-full items-center justify-center p-6"
    >
      <div className="w-full max-w-sm">
        {/* Receipt card */}
        <div
          style={{
            background: "#FBFAF5",
            boxShadow:
              "0 1px 2px rgba(20,35,28,0.06), 0 12px 32px -12px rgba(20,35,28,0.22)",
          }}
          className="relative overflow-hidden rounded-t-2xl"
        >
          {/* Top band */}
          <div
            style={{ background: "#16241F" }}
            className="flex flex-col items-center gap-3 px-8 pb-8 pt-9"
          >
            <div
              style={{
                background: "#B5482D",
                boxShadow: "0 0 0 6px rgba(181,72,45,0.18)",
              }}
              className="flex h-14 w-14 items-center justify-center rounded-full"
            >
              <X size={28} strokeWidth={3} color="#FBFAF5" />
            </div>
            <p
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                color: "#F7FBF9",
              }}
              className="text-[13px] font-medium uppercase tracking-[0.28em]"
            >
              Transfer failed
            </p>
          </div>

          {/* Amount */}
          <div className="flex flex-col items-center gap-1 px-8 pb-5 pt-8">
            <span
              style={{ color: "#5B6B62" }}
              className="text-[11px] uppercase tracking-[0.22em]"
            >
              Amount not sent
            </span>
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                color: "#16241F",
              }}
              className="text-[40px] font-semibold leading-none tabular-nums line-through decoration-2"
            >
              {formatRupees(amount)}
            </span>
            <div
              style={{ color: "#B5482D" }}
              className="mt-3 flex items-center gap-1 text-[12px] font-medium"
            >
              <ArrowUpRight size={14} strokeWidth={2.5} />
              <span>to {recipient}</span>
            </div>
          </div>

          {/* Reason */}
          <div className="px-8 pb-6">
            <p
              style={{ background: "#F3E7E1", color: "#8A3B22" }}
              className="rounded-lg px-3 py-2.5 text-[11.5px] leading-relaxed"
            >
              {reason}
            </p>
          </div>

          {/* Dashed divider */}
          <div className="px-8">
            <div
              style={{ borderColor: "#C9C2AC" }}
              className="border-t border-dashed"
            />
          </div>

          {/* Details */}
          <dl className="grid grid-cols-2 gap-y-3 px-8 py-6 text-[11.5px]">
            <dt style={{ color: "#8A8272" }} className="uppercase tracking-wide">
              Reference
            </dt>
            <dd style={{ color: "#16241F" }} className="text-right">
              {transactionId}
            </dd>
            <dt style={{ color: "#8A8272" }} className="uppercase tracking-wide">
              Date
            </dt>
            <dd style={{ color: "#16241F" }} className="text-right">
              {dateLabel}
            </dd>
            <dt style={{ color: "#8A8272" }} className="uppercase tracking-wide">
              Status
            </dt>
            <dd style={{ color: "#B5482D" }} className="text-right font-semibold">
              Failed
            </dd>
          </dl>

          {/* Perforated tear edge */}
          <div
            aria-hidden
            style={{
              height: 18,
              background:
                "radial-gradient(circle at 9px 0, transparent 9px, #FBFAF5 9.5px)",
              backgroundSize: "18px 18px",
              backgroundPosition: "-9px 0",
            }}
          />
        </div>

        {/* Stub shadow ledge */}
        <div
          style={{ background: "#16241F0d" }}
          className="mx-3 h-2 rounded-b-xl"
        />

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            style={{ background: "#16241F", color: "#F7FBF9" }}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          >
            <RotateCw
              size={14}
              strokeWidth={2.5}
              className={retrying ? "animate-spin" : ""}
            />
            {retrying ? "Retrying" : "Retry transfer"}
          </button>
          <button
            onClick={onCancel}
            style={{ color: "#5B6B62", borderColor: "#C9C2AC" }}
            className="w-full rounded-xl border border-solid bg-transparent py-3 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-black/[0.03]"
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}
