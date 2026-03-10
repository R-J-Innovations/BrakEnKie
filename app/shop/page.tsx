"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_display: string;
  category: string;
  is_active: boolean;
  product_images: { image_url: string }[];
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("*, product_images (image_url)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="px-6 py-24 max-w-6xl mx-auto">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Merchandise
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Shop</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <p className="opacity-45 text-base font-light">BrakEnKie merchandise and accessories.</p>
      </div>

      {loading ? (
        <div className="text-center opacity-25 py-20 text-[11px] tracking-[0.35em] uppercase font-sans animate-pulse">
          Loading&hellip;
        </div>
      ) : products.length === 0 ? (
        <div className="text-center opacity-25 py-20 text-[11px] tracking-[0.35em] uppercase font-sans">
          No products available yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <div className="group bg-[var(--card)] border border-[var(--accent)]/10 overflow-hidden hover:border-[var(--accent)]/25 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(184,147,90,0.1)] transition-all duration-500 cursor-pointer">
                <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-stone-900">
                  <img
                    src={
                      product.product_images?.[0]?.image_url ||
                      "https://placehold.co/600x600"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 border-t border-[var(--accent)]/10">
                  {product.category && (
                    <p className="text-[10px] uppercase tracking-[0.25em] opacity-35 mb-2 font-sans">
                      {product.category}
                    </p>
                  )}
                  <h3 className="font-serif text-xl font-light mb-2">{product.name}</h3>
                  <p className="text-sm font-sans text-[var(--accent)]">
                    {product.price_display}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
