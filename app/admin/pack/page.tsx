"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type PackMember = {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

export default function ManagePack() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [pack, setPack] = useState<PackMember[]>([]);

  // Add form state
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      setSession(session);
      await fetchPack();
    }
    init();
  }, []);

  async function fetchPack() {
    const { data } = await supabase
      .from("pack")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setPack(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);

    let image_url: string | null = null;

    if (file) {
      const filePath = `pack/${uuidv4()}`;
      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file);
      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setAdding(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(filePath);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("pack")
      .insert([{ name: name.trim(), image_url, sort_order: pack.length }]);

    if (error) {
      alert("Error adding pack member: " + error.message);
    } else {
      setName("");
      setFile(null);
      await fetchPack();
    }
    setAdding(false);
  }

  async function handleImageUpdate(id: string, file: File) {
    const filePath = `pack/${uuidv4()}`;
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file);
    if (uploadError) { alert("Upload failed: " + uploadError.message); return; }

    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    await supabase.from("pack").update({ image_url: urlData.publicUrl }).eq("id", id);
    await fetchPack();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name} from the pack?`)) return;
    await supabase.from("pack").delete().eq("id", id);
    setPack((prev) => prev.filter((p) => p.id !== id));
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center gap-4 mb-10">
        <a href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-serif">Manage The Pack</h1>
      </div>

      <div className="max-w-3xl space-y-10">

        {/* Add new member */}
        <section className="bg-[var(--card)] rounded-2xl p-8">
          <h2 className="font-serif text-xl mb-6">Add Pack Member</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20"
            />
            <div>
              <label className="block text-sm opacity-50 mb-1">Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-3 bg-[var(--accent)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              {adding ? "Adding..." : "Add to Pack"}
            </button>
          </form>
        </section>

        {/* Current pack */}
        <section>
          <h2 className="font-serif text-xl mb-4">Current Pack</h2>
          <div className="space-y-4">
            {pack.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-[var(--card)] rounded-xl shadow"
              >
                {/* Photo */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20 text-xs">No photo</div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 font-serif text-lg">{member.name}</div>

                {/* Replace photo */}
                <label className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg text-xs cursor-pointer hover:opacity-80 transition flex-shrink-0">
                  {member.image_url ? "Replace Photo" : "Add Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpdate(member.id, f);
                    }}
                  />
                </label>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
            {pack.length === 0 && (
              <p className="opacity-40 text-sm">No pack members yet. Add one above.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
