"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  category: string;
  price_display: string;
  is_active: boolean;
  product_images: { image_url: string }[];
};

export default function ManageProducts() {
  const [session, setSession] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setSession(session);

      const { data } = await supabase
        .from("products")
        .select("*, product_images (image_url)")
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
    }
    init();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
    );
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <a href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
            ← Dashboard
          </a>
          <h1 className="text-3xl font-serif">Manage Products</h1>
        </div>
        <a
          href="/admin/products/new"
          className="px-4 py-2 bg-[var(--accent)] rounded-lg text-black text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Add Product
        </a>
      </div>

      <div className="space-y-4 max-w-4xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 bg-[var(--card)] rounded-xl shadow"
          >
            <img
              src={
                product.product_images?.[0]?.image_url ||
                "https://placehold.co/80x80"
              }
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg">{product.name}</h3>
              <p className="text-sm opacity-50">
                {product.category} &middot; {product.price_display}
              </p>
            </div>
            <button
              onClick={() => toggleActive(product.id, product.is_active)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                product.is_active
                  ? "bg-green-500 text-white"
                  : "bg-stone-300 dark:bg-stone-700 text-[var(--text)]"
              }`}
            >
              {product.is_active ? "Active" : "Inactive"}
            </button>
            <button
              onClick={() => deleteProduct(product.id, product.name)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex-shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <p className="opacity-50">
            No products yet.{" "}
            <a href="/admin/products/new" className="underline">
              Add one.
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
