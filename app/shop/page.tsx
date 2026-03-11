"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  name: string;
  category: string;
  price_display: string;
  description: string;
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
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8 text-[var(--accent)]">Shop</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <span className="text-xs opacity-40">🐾</span>
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <div className="flex justify-center gap-5 mt-6 mb-6">
          <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-[11px] tracking-[0.4em] uppercase opacity-25 font-sans py-32 animate-pulse">
          Loading&hellip;
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-[11px] tracking-[0.4em] uppercase opacity-30 font-sans py-32">
          Currently no merch, watch this space&hellip;
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const img = product.product_images?.[0]?.image_url;
            return (
              <div
                key={product.id}
                className="group bg-[var(--card)] border border-[var(--accent)]/10 overflow-hidden hover:border-[var(--accent)]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(184,147,90,0.1)] transition-all duration-500"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--card)]">
                  {img ? (
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-15">
                      <span className="text-[10px] tracking-[0.3em] uppercase font-sans">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-[var(--accent)]/10">
                  <div className="h-px w-6 bg-[var(--accent)]/40 mb-4 group-hover:w-10 transition-all duration-500" />
                  {product.category && (
                    <p className="text-[10px] tracking-[0.3em] uppercase opacity-35 font-sans mb-2">{product.category}</p>
                  )}
                  <h3 className="font-serif text-xl font-light mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm opacity-45 leading-relaxed mb-4">{product.description}</p>
                  )}
                  {product.price_display && (
                    <p className="text-[var(--accent)] font-sans text-sm tracking-wide">{product.price_display}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </main>
  );
}
