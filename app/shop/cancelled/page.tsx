"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CancelledContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const invoiceNumber = orderId
    ? `BK-${orderId.substring(0, 8).toUpperCase()}`
    : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-8 opacity-40">✕</div>
        <h1 className="text-3xl md:text-4xl font-serif font-light mb-4">
          Payment Cancelled
        </h1>
        {invoiceNumber && (
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 font-sans">
            Order {invoiceNumber}
          </p>
        )}
        <div className="h-px bg-[var(--accent)]/15 mb-6" />
        <p className="opacity-55 leading-relaxed mb-10 font-light text-sm">
          Your payment was not completed and you have not been charged. If you
          changed your mind or ran into an issue, feel free to try again or
          contact us.
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
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}

export default function CancelledPage() {
  return (
    <Suspense>
      <CancelledContent />
    </Suspense>
  );
}
