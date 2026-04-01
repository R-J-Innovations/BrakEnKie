"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

const DELIVERY_FEE = 99;

type CheckoutState = "idle" | "processing" | "redirecting";

type AddressSuggestion = {
  display_name: string;
  place_id: string;
};

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  // Buyer form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [complexName, setComplexName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formError, setFormError] = useState("");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");

  const pfFormRef = useRef<HTMLFormElement>(null);
  const [pfData, setPfData] = useState<{ url: string; fields: Record<string, string> } | null>(null);

  useEffect(() => {
    if (pfData && pfFormRef.current) {
      pfFormRef.current.submit();
    }
  }, [pfData]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 4) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=za&addressdetails=0&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      const results = await res.json();
      setAddressSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  function handleAddressInput(value: string) {
    setAddress(value);
    setShowSuggestions(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(value), 400);
  }

  function selectSuggestion(suggestion: AddressSuggestion) {
    setAddress(suggestion.display_name);
    setAddressSuggestions([]);
    setShowSuggestions(false);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.");
      return;
    }
    if (!address.trim()) {
      setFormError("Please enter your delivery address.");
      return;
    }

    setCheckoutState("processing");

    const fullAddress = [
      complexName.trim(),
      streetNumber.trim(),
      address.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
          })),
          buyerFirstName: firstName.trim(),
          buyerLastName: lastName.trim(),
          buyerEmail: email.trim() || undefined,
          buyerPhone: phone.trim() || undefined,
          deliveryAddress: fullAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        setCheckoutState("idle");
        return;
      }

      clearCart();
      setCheckoutState("redirecting");
      setPfData({ url: data.url, fields: data.fields });
    } catch {
      setFormError("Network error. Please try again.");
      setCheckoutState("idle");
    }
  }

  const grandTotal = subtotal + DELIVERY_FEE;

  if (items.length === 0 && checkoutState !== "redirecting") {
    return (
      <main className="px-6 lg:px-16 py-16 max-w-4xl mx-auto w-full min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-30 font-sans">
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.3em] uppercase opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 font-sans"
        >
          &larr; Browse Merch
        </Link>
      </main>
    );
  }

  if (checkoutState === "redirecting") {
    return (
      <main className="px-6 py-16 max-w-4xl mx-auto w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-40 font-sans animate-pulse">
          Redirecting to payment&hellip;
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 lg:px-16 py-16 max-w-6xl mx-auto w-full">

      <div className="mb-10 flex items-baseline justify-between">
        <h1 className="text-3xl md:text-4xl font-serif font-light">Your Cart</h1>
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.3em] uppercase opacity-35 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 font-sans"
        >
          &larr; Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">

        {/* Cart items */}
        <div>
          <div className="border-t border-[var(--accent)]/10">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 py-6 border-b border-[var(--accent)]/10"
              >
                {/* Image */}
                {item.imageUrl ? (
                  <div className="relative w-20 h-20 flex-shrink-0 bg-[var(--card)]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex-shrink-0 bg-[var(--card)] border border-[var(--accent)]/10" />
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base mb-1 truncate">{item.name}</p>
                  {item.size && (
                    <p className="text-[11px] opacity-45 font-sans mb-2">Size: {item.size}</p>
                  )}
                  <p className="text-[var(--accent)] text-sm font-sans">
                    R {item.price.toFixed(2)}
                  </p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end gap-3">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, item.size, Number(e.target.value))
                    }
                    className="px-2 py-1 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <p className="text-sm font-sans font-medium">
                    R {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-[10px] tracking-[0.2em] uppercase opacity-30 hover:opacity-70 hover:text-red-400 transition-all duration-200 font-sans"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery fee note */}
          <div className="flex justify-between items-center py-4 border-b border-[var(--accent)]/10">
            <div>
              <p className="text-sm font-sans opacity-70">Courier Guy Delivery</p>
              <p className="text-[10px] opacity-35 font-sans mt-0.5">Flat rate — one fee per order</p>
            </div>
            <p className="text-sm font-sans">R {DELIVERY_FEE.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center pt-5">
            <p className="text-base font-serif">Total</p>
            <p className="text-xl font-serif text-[var(--accent)]">R {grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Checkout form */}
        <div className="border border-[var(--accent)]/15 p-6 bg-[var(--card)]">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 font-sans mb-5">
            Delivery Details
          </p>

          <form onSubmit={handleCheckout} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name *"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
              />
              <input
                type="text"
                placeholder="Last Name *"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
              />
            </div>
            <input
              type="email"
              placeholder="Email (for invoice)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Complex / Estate (optional)"
                value={complexName}
                onChange={(e) => setComplexName(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
              />
              <input
                type="text"
                placeholder="Street No. (optional)"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Delivery Address *"
                required
                value={address}
                onChange={(e) => handleAddressInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-[var(--card)] border border-[var(--accent)]/20 shadow-lg mt-px max-h-52 overflow-y-auto">
                  {addressSuggestions.map((s) => (
                    <li
                      key={s.place_id}
                      onMouseDown={() => selectSuggestion(s)}
                      className="px-4 py-3 text-xs font-sans cursor-pointer hover:bg-[var(--accent)]/10 border-b border-[var(--accent)]/8 last:border-0 leading-snug"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-[10px] opacity-35 font-sans mt-1">
                Start typing your street address &mdash; select from the suggestions
              </p>
            </div>

            {/* Order summary inside form */}
            <div className="border-t border-[var(--accent)]/10 pt-3 space-y-1">
              <div className="flex justify-between text-xs font-sans opacity-55">
                <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>R {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-sans opacity-55">
                <span>Courier Guy delivery</span>
                <span>R {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans font-medium border-t border-[var(--accent)]/10 pt-2 mt-1">
                <span>Total</span>
                <span className="text-[var(--accent)]">R {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {formError && (
              <p className="text-red-500 text-xs font-sans">{formError}</p>
            )}

            <p className="text-[10px] opacity-35 font-sans leading-relaxed">
              No email? An invoice will be sent to info@brakenkie.co.za who will forward it to you.
            </p>

            <button
              type="submit"
              disabled={checkoutState === "processing"}
              className="block w-full text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300 disabled:opacity-40"
            >
              {checkoutState === "processing"
                ? "Processing\u2026"
                : `Pay R\u00a0${grandTotal.toFixed(2)} via PayFast`}
            </button>

            <p className="text-[10px] opacity-25 font-sans text-center">
              Secured by PayFast &mdash; South Africa&apos;s trusted payment gateway
            </p>
          </form>
        </div>
      </div>

      {/* Hidden PayFast form */}
      {pfData && (
        <form
          ref={pfFormRef}
          method="POST"
          action={pfData.url}
          style={{ display: "none" }}
        >
          {Object.entries(pfData.fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </main>
  );
}
