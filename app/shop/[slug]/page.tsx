"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PuppyGallery from "@/components/PuppyGallery";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

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

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

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
        setFetchError(error?.message || "Product not found");
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    }

    if (slug) fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

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

  function handleAddToCart() {
    if (!product || !canBuyNow) return;
    const selectedSize = isOneSize ? sizeOptions[0] : size;
    if (!isOneSize && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price!,
      imageUrl: product.product_images?.[0]?.image_url,
      quantity,
      size: selectedSize || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

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

          {canBuyNow ? (
            <div className="space-y-4">
              {/* Size selector */}
              {!isOneSize && (
                <div className="flex items-center gap-3">
                  <label className="text-[11px] tracking-[0.2em] uppercase opacity-50 font-sans w-10">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => { setSize(e.target.value); setSizeError(false); }}
                    className={`px-3 py-2 bg-[var(--bg)] border focus:border-[var(--accent)]/40 outline-none text-sm font-sans transition-colors ${
                      sizeError ? "border-red-400" : "border-[var(--accent)]/15"
                    }`}
                  >
                    <option value="">Select size</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {sizeError && (
                    <span className="text-red-400 text-[11px] font-sans">Required</span>
                  )}
                </div>
              )}
              {isOneSize && (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] tracking-[0.2em] uppercase opacity-50 font-sans w-10">Size</span>
                  <span className="text-sm font-sans opacity-70">{sizeOptions[0]}</span>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <label className="text-[11px] tracking-[0.2em] uppercase opacity-50 font-sans w-10">
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

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className={`block w-full text-center px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-sans transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
                }`}
              >
                {added ? "Added to Cart \u2713" : "Add to Cart"}
              </button>

              {added && (
                <div className="flex items-center justify-between">
                  <p className="text-[11px] opacity-50 font-sans">
                    Item added to your cart
                  </p>
                  <Link
                    href="/cart"
                    className="text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] hover:opacity-70 font-sans transition-opacity"
                  >
                    View Cart &rarr;
                  </Link>
                </div>
              )}

              <p className="text-[10px] opacity-35 font-sans leading-relaxed">
                Made to order &mdash; allow 7&ndash;14 working days for delivery
              </p>
            </div>
          ) : (
            <a
              href={`https://wa.me/27718981890?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
            >
              Enquire on WhatsApp
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
