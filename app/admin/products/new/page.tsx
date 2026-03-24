"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function AddProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const slug = toSlug(name);

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          slug,
          category,
          description,
          price_display: price ? `R ${parseFloat(price).toFixed(2).replace(/\.00$/, "")}` : "",
          price: price ? parseFloat(price) : null,
          featured,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error || !product) {
      alert("Error creating product: " + error?.message);
      setLoading(false);
      return;
    }

    if (images) {
      const uploads = Array.from(images).map(async (file) => {
        const filePath = `products/${product.id}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);
        if (uploadError) {
          alert(`Error uploading ${file.name}: ${uploadError.message}`);
          return;
        }
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
        await supabase
          .from("product_images")
          .insert([{ product_id: product.id, image_url: data.publicUrl }]);
      });
      await Promise.all(uploads);
    }

    router.push("/admin/products");
  }

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center gap-4 mb-10">
        <a href="/admin/products" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
          ← Products
        </a>
        <h1 className="text-3xl font-serif">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <input
          placeholder="Product Name"
          required
          className="w-full p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Category (e.g. Apparel, Accessories)"
          className="w-full p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20"
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price in Rands (e.g. 350)"
          step="0.01"
          min="0"
          className="w-full p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20"
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          placeholder="Description"
          rows={4}
          className="w-full p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20"
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured Product
        </label>
        <div>
          <label className="block text-sm opacity-50 mb-2">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-yellow-500 rounded-lg text-black font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
