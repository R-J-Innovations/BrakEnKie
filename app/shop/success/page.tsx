"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const invoiceNumber = orderId
    ? `BK-${orderId.substring(0, 8).toUpperCase()}`
    : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-8">🐾</div>
        <h1 className="text-3xl md:text-4xl font-serif font-light mb-4">
          Thank you!
        </h1>
        {invoiceNumber && (
          <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--accent)] mb-6 font-sans">
            Order {invoiceNumber}
          </p>
        )}
        <div className="h-px bg-[var(--accent)]/15 mb-6" />
        <p className="opacity-55 leading-relaxed mb-3 font-light text-sm">
          Your payment was successful. An invoice has been sent to{" "}
          <strong>info@brakenkie.co.za</strong>.
        </p>
        <p className="opacity-45 leading-relaxed mb-3 font-light text-sm">
          If you provided your email address, you will receive a copy of your
          invoice shortly. If you have any questions, please reach out via
          WhatsApp or email.
        </p>
        <p className="opacity-45 leading-relaxed mb-10 font-light text-sm">
          As all orders are made to order, please allow{" "}
          <strong>5–10 working days</strong> for delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
          >
            Back to Shop
          </Link>
          <a
            href="https://wa.me/27718981890"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[var(--accent)]/30 text-[11px] tracking-[0.3em] uppercase font-sans hover:border-[var(--accent)] transition-all duration-300"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
