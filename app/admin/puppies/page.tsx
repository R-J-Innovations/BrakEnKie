"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Puppy = {
  id: string;
  name: string;
  gender: string;
  color: string;
  status: string;
  featured: boolean;
  puppy_images: { image_url: string }[];
};

export default function ManagePuppies() {
  const [session, setSession] = useState<any>(null);
  const [puppies, setPuppies] = useState<Puppy[]>([]);
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
        .from("puppies")
        .select("*, puppy_images (image_url)")
        .order("created_at", { ascending: false });
      if (data) setPuppies(data);
    }
    init();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("puppies").update({ status }).eq("id", id);
    setPuppies((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from("puppies").update({ featured: !current }).eq("id", id);
    setPuppies((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)));
  }

  async function deletePuppy(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    await supabase.from("puppies").delete().eq("id", id);
    setPuppies((prev) => prev.filter((p) => p.id !== id));
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center gap-4 mb-10">
        <a href="/admin" className="text-sm opacity-60 hover:opacity-100">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-serif">Manage Puppies</h1>
      </div>

      <div className="space-y-4 max-w-4xl">
        {puppies.map((puppy) => (
          <div
            key={puppy.id}
            className="flex items-center gap-4 p-4 bg-[var(--card)] rounded-xl shadow"
          >
            <img
              src={puppy.puppy_images?.[0]?.image_url || "https://placehold.co/80x80"}
              alt={puppy.name}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg">{puppy.name}</h3>
              <p className="text-sm opacity-60">
                {puppy.gender} • {puppy.color}
              </p>
            </div>
            <button
              onClick={() => toggleFeatured(puppy.id, puppy.featured)}
              title="Toggle Previous Puppies"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex-shrink-0 ${
                puppy.featured
                  ? "bg-[var(--accent)] text-black"
                  : "bg-stone-200 dark:bg-stone-700 text-[var(--text)] opacity-50"
              }`}
            >
              {puppy.featured ? "★ Featured" : "☆ Feature"}
            </button>
            <select
              value={puppy.status}
              onChange={(e) => updateStatus(puppy.id, e.target.value)}
              className="p-2 rounded-lg border bg-[var(--bg)] text-[var(--text)] text-sm"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <button
              onClick={() => deletePuppy(puppy.id, puppy.name)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex-shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
        {puppies.length === 0 && (
          <p className="opacity-60">No puppies yet.</p>
        )}
      </div>
    </div>
  );
}
