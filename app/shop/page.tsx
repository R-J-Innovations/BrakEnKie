"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Required Supabase table: products
// Columns: id (uuid), name (text), slug (text unique), description (text),
//          price_display (text), category (text), is_active (bool default true),
//          featured (bool default false), created_at (timestamptz default now())
// Required table: product_images
// Columns: id (uuid), product_id (uuid FK), image_url (text)
// Required storage bucket: product-images

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
    <main className="px-6 py-20 max-w-6xl mx-auto">
      <h1 className="text-4xl font-serif mb-4 text-center">Shop</h1>
      <p className="text-center opacity-60 mb-12">BrakEnKie merchandise and accessories.</p>

      {loading ? (
        <div className="text-center opacity-40 py-20">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center opacity-40 py-20">No products available yet.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <div className="bg-[var(--card)] rounded-2xl shadow overflow-hidden hover:scale-[1.02] transition cursor-pointer">
                <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={
                      product.product_images?.[0]?.image_url ||
                      "https://placehold.co/600x600"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  {product.category && (
                    <p className="text-xs uppercase tracking-widest opacity-40 mb-1">
                      {product.category}
                    </p>
                  )}
                  <h3 className="font-serif text-xl mb-1">{product.name}</h3>
                  <p className="font-medium text-[var(--accent)]">
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
