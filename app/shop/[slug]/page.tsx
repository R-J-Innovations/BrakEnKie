"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PuppyGallery from "@/components/PuppyGallery";

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

  if (loading) return <div className="p-10 opacity-40">Loading...</div>;
  if (!product) return null;

  return (
    <main className="px-6 py-20 max-w-5xl mx-auto">
      <a
        href="/shop"
        className="text-sm opacity-50 hover:opacity-100 transition-opacity mb-10 inline-block"
      >
        ← Back to Shop
      </a>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          {product.product_images?.length ? (
            <PuppyGallery images={product.product_images} />
          ) : (
            <img
              src="https://placehold.co/600x600"
              alt={product.name}
              className="w-full rounded-2xl"
            />
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
              {product.category}
            </p>
          )}
          <h1 className="text-4xl font-serif mb-3">{product.name}</h1>
          <p className="text-2xl font-medium text-[var(--accent)] mb-6">
            {product.price_display}
          </p>
          <p className="opacity-70 leading-relaxed mb-8">{product.description}</p>
          <a
            href={`https://wa.me/27XXXXXXXXX?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-8 py-4 bg-yellow-500 rounded-xl font-medium text-black hover:opacity-90 transition-opacity"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
