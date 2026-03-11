"use client";
import { useEffect, useState } from "react";
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
  category: string;
  product_images: { image_url: string }[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params as { slug: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images (image_url)")
        .eq("slug", slug)
        .single();

      if (cancelled) return;

      if (error || !data) {
        router.push("/shop");
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-25 font-sans animate-pulse">
          Loading&hellip;
        </p>
      </div>
    );

  if (!product) return null;

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

          <a
            href={`https://wa.me/27718981890?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
