"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PuppyGallery from "@/components/PuppyGallery";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_display: string;
  price: number | null;
  category: string;
  product_images: { image_url: string }[];
};

type CheckoutState = "idle" | "form" | "processing" | "redirecting";

type AddressSuggestion = {
  display_name: string;
  place_id: string;
};

const DELIVERY_FEE = 99;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params as { slug: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");

  // Buyer form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [address, setAddress] = useState("");
  const [complexName, setComplexName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [formError, setFormError] = useState("");

  // Address autocomplete state (Nominatim / OpenStreetMap — free, no API key)
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidden PayFast form ref — we populate + submit it programmatically
  const pfFormRef = useRef<HTMLFormElement>(null);
  const [pfData, setPfData] = useState<{ url: string; fields: Record<string, string> } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const query = supabase
        .from("products")
        .select("*, product_images (image_url)");

      const { data, error } = await (isUuid
        ? query.or(`slug.eq.${slug},id.eq.${slug}`)
        : query.eq("slug", slug)
      ).single();

      if (cancelled) return;

      if (error || !data) {
        console.error("Fetch error:", error);
        setFetchError(error?.message || "Product not found");
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    }

    if (slug) fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  // Fetch address suggestions from Nominatim (OpenStreetMap) — free, no API key needed
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

  // When pfData is set, submit the hidden form to PayFast
  useEffect(() => {
    if (pfData && pfFormRef.current) {
      pfFormRef.current.submit();
    }
  }, [pfData]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter your first and last name.");
      return;
    }

    if (!size && !isOneSize) {
      setFormError("Please select a size.");
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
    ].filter(Boolean).join(", ");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product!.id,
          buyerFirstName: firstName.trim(),
          buyerLastName: lastName.trim(),
          buyerEmail: email.trim() || undefined,
          buyerPhone: phone.trim() || undefined,
          quantity,
          size,
          deliveryAddress: fullAddress,
          deliveryFee: DELIVERY_FEE,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        setCheckoutState("form");
        return;
      }

      setCheckoutState("redirecting");
      setPfData({ url: data.url, fields: data.fields });
    } catch {
      setFormError("Network error. Please try again.");
      setCheckoutState("form");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-25 font-sans animate-pulse">
          Loading&hellip;
        </p>
      </div>
    );

  if (fetchError)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-sans text-sm">Error: {fetchError}</p>
        <Link href="/shop" className="text-[11px] tracking-[0.3em] uppercase opacity-50 hover:opacity-100 font-sans">
          &larr; Back to Shop
        </Link>
      </div>
    );

  if (!product) return null;

  const canBuyNow = product.price && product.price > 0;

  const productKey = `${product.name} ${product.category}`.toLowerCase();
  const sizeOptions: string[] =
    productKey.includes("bucket")
      ? ["S/M – 56cm", "L/XL – 59cm"]
      : productKey.includes("cap")
      ? ["One Size"]
      : ["XS", "S", "M", "L", "XL", "XXL"];
  const isOneSize = sizeOptions.length === 1;

  const productTotal = product.price ? product.price * quantity : 0;
  const grandTotal = productTotal + DELIVERY_FEE;

  return (
    <main className="px-6 lg:px-16 py-16 max-w-7xl mx-auto w-full">

      <Link
        href="/shop"
        className="text-[11px] tracking-[0.3em] uppercase opacity-35 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 mb-14 inline-block font-sans"
      >
        &larr; Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-16 items-start mt-4">
        <div>
          {product.product_images?.length ? (
            <PuppyGallery images={product.product_images} />
          ) : (
            <div className="aspect-square bg-[var(--card)] border border-[var(--accent)]/10 flex items-center justify-center">
              <span className="text-[11px] tracking-[0.3em] uppercase opacity-20 font-sans">No Images</span>
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--accent)] opacity-70 mb-4 font-sans">
              {product.category}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">{product.name}</h1>
          <p className="text-2xl font-light text-[var(--accent)] mb-8 font-serif">
            {product.price_display}
          </p>

          <div className="h-px bg-[var(--accent)]/12 mb-8" />

          <p className="opacity-55 leading-relaxed mb-10 font-light">{product.description}</p>

          {/* PayFast checkout */}
          {canBuyNow && checkoutState === "idle" && (
            <>
              <button
                onClick={() => { setCheckoutState("form"); if (isOneSize) setSize(sizeOptions[0]); }}
                className="block w-full text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
              >
                Order &amp; Pay Online
              </button>
              <p className="text-[10px] opacity-40 font-sans mt-3 text-center leading-relaxed">
                Made to order &mdash; allow 7&ndash;14 working days for delivery
              </p>
            </>
          )}

          {/* WhatsApp enquiry — fallback for products without a price */}
          {!canBuyNow && (
            <a
              href={`https://wa.me/27718981890?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
            >
              Enquire on WhatsApp
            </a>
          )}

          {/* Checkout form */}
          {canBuyNow && (checkoutState === "form" || checkoutState === "processing" || checkoutState === "redirecting") && (
            <div className="mt-2 border border-[var(--accent)]/15 p-6 bg-[var(--card)]">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 font-sans">
                  Secure Checkout
                </p>
                {checkoutState === "form" && (
                  <button
                    onClick={() => { setCheckoutState("idle"); setFormError(""); }}
                    className="text-[10px] tracking-[0.2em] uppercase opacity-35 hover:opacity-70 transition-opacity font-sans"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {checkoutState === "redirecting" ? (
                <p className="text-center text-[11px] tracking-[0.3em] uppercase opacity-40 font-sans animate-pulse py-8">
                  Redirecting to payment&hellip;
                </p>
              ) : (
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

                  {/* Delivery address with Nominatim (OpenStreetMap) autocomplete */}
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

                  <div className="flex items-center gap-3 py-1">
                    <label className="text-[11px] tracking-[0.2em] uppercase opacity-50 font-sans">
                      Size{!isOneSize && " *"}
                    </label>
                    {isOneSize ? (
                      <span className="px-3 py-2 text-sm font-sans opacity-70">{sizeOptions[0]}</span>
                    ) : (
                      <select
                        required
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="px-3 py-2 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
                      >
                        <option value="">Select size</option>
                        {sizeOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <label className="text-[11px] tracking-[0.2em] uppercase opacity-50 font-sans">
                      Qty
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="px-3 py-2 bg-[var(--bg)] border border-[var(--accent)]/15 focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Order summary */}
                  <div className="border-t border-[var(--accent)]/10 pt-3 mt-1 space-y-1">
                    <div className="flex justify-between text-xs font-sans opacity-55">
                      <span>Product{quantity > 1 ? ` × ${quantity}` : ""}</span>
                      <span>R {productTotal.toFixed(2)}</span>
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
                    {checkoutState === "processing" ? "Processing…" : `Pay R ${grandTotal.toFixed(2)} via PayFast`}
                  </button>

                  <p className="text-[10px] opacity-25 font-sans text-center">
                    Secured by PayFast &mdash; South Africa&apos;s trusted payment gateway
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden PayFast form — auto-submitted when pfData is set */}
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
