"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type PuppyImage = { id?: string; image_url: string };

type Puppy = {
  id: string;
  name: string;
  gender: string;
  color: string;
  dob: string | null;
  description: string;
  status: string;
  featured: boolean;
  puppy_images: PuppyImage[];
};

const inputCls = "w-full p-2.5 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20 text-sm";

export default function ManagePuppies() {
  const [session, setSession] = useState<any>(null);
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Puppy>>>({});
  const [newImages, setNewImages] = useState<Record<string, FileList | null>>({});
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      setSession(session);
      await fetchPuppies();
    }
    init();
  }, []);

  async function fetchPuppies() {
    const { data } = await supabase
      .from("puppies")
      .select("*, puppy_images (id, image_url)")
      .order("created_at", { ascending: false });
    if (data) setPuppies(data);
  }

  function startEdit(puppy: Puppy) {
    setExpanded(puppy.id);
    setEdits((prev) => ({ ...prev, [puppy.id]: { ...puppy } }));
  }

  function setField(id: string, field: keyof Puppy, value: any) {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function saveEdits(id: string) {
    const e = edits[id];
    if (!e) return;
    setSaving(id);

    await supabase.from("puppies").update({
      name: e.name,
      gender: e.gender,
      color: e.color,
      dob: e.dob || null,
      description: e.description,
      status: e.status,
      featured: e.featured,
    }).eq("id", id);

    // Upload new images
    const files = newImages[id];
    if (files && files.length > 0) {
      await Promise.all(Array.from(files).map(async (file) => {
        const filePath = `puppies/${id}/${uuidv4()}`;
        const { error } = await supabase.storage.from("puppy-images").upload(filePath, file);
        if (error) { alert("Upload failed: " + error.message); return; }
        const { data } = supabase.storage.from("puppy-images").getPublicUrl(filePath);
        await supabase.from("puppy_images").insert([{ puppy_id: id, image_url: data.publicUrl }]);
      }));
      setNewImages((prev) => ({ ...prev, [id]: null }));
    }

    await fetchPuppies();
    setSaving(null);
    setExpanded(null);
  }

  async function deleteImage(puppyId: string, imageId: string | undefined, imageUrl: string) {
    if (!confirm("Delete this image?")) return;
    if (imageId) await supabase.from("puppy_images").delete().eq("id", imageId);
    setPuppies((prev) => prev.map((p) =>
      p.id === puppyId ? { ...p, puppy_images: p.puppy_images.filter((i) => i.image_url !== imageUrl) } : p
    ));
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
        <a href="/admin" className="text-sm opacity-60 hover:opacity-100">← Dashboard</a>
        <h1 className="text-3xl font-serif">Manage Puppies</h1>
        <a href="/admin/new" className="ml-auto px-4 py-2 bg-[var(--accent)] rounded-lg text-black text-sm font-medium hover:opacity-90 transition-opacity">
          + Add Puppy
        </a>
      </div>

      <div className="space-y-4 max-w-4xl">
        {puppies.map((puppy) => {
          const isOpen = expanded === puppy.id;
          const e = edits[puppy.id] ?? puppy;
          return (
            <div key={puppy.id} className="bg-[var(--card)] rounded-xl shadow overflow-hidden">

              {/* Row */}
              <div className="flex items-center gap-4 p-4">
                <img
                  src={puppy.puppy_images?.[0]?.image_url || "https://placehold.co/80x80"}
                  alt={puppy.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg leading-tight">{puppy.name}</h3>
                  <p className="text-sm opacity-50">{puppy.gender} · {puppy.color} · <span className="capitalize">{puppy.status}</span></p>
                </div>
                <button
                  onClick={() => isOpen ? setExpanded(null) : startEdit(puppy)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-200 dark:bg-stone-700 hover:opacity-80 transition flex-shrink-0"
                >
                  {isOpen ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => deletePuppy(puppy.id, puppy.name)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs flex-shrink-0"
                >
                  Delete
                </button>
              </div>

              {/* Edit panel */}
              {isOpen && (
                <div className="border-t border-black/10 dark:border-white/10 p-6 space-y-5">

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs opacity-50 mb-1">Name</label>
                      <input className={inputCls} value={e.name ?? ""} onChange={(ev) => setField(puppy.id, "name", ev.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs opacity-50 mb-1">Gender</label>
                      <select className={inputCls} value={e.gender ?? "Male"} onChange={(ev) => setField(puppy.id, "gender", ev.target.value)}>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs opacity-50 mb-1">Colour</label>
                      <input className={inputCls} value={e.color ?? ""} onChange={(ev) => setField(puppy.id, "color", ev.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs opacity-50 mb-1">Date of Birth</label>
                      <input type="date" className={inputCls} value={e.dob ?? ""} onChange={(ev) => setField(puppy.id, "dob", ev.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs opacity-50 mb-1">Status</label>
                      <select className={inputCls} value={e.status ?? "available"} onChange={(ev) => setField(puppy.id, "status", ev.target.value)}>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={e.featured ?? false} onChange={(ev) => setField(puppy.id, "featured", ev.target.checked)} />
                        Featured (show in sold carousel)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs opacity-50 mb-1">Description</label>
                    <textarea className={inputCls} rows={3} value={e.description ?? ""} onChange={(ev) => setField(puppy.id, "description", ev.target.value)} />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-xs opacity-50 mb-2">Images</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {puppy.puppy_images.map((img) => (
                        <div key={img.image_url} className="relative group">
                          <img src={img.image_url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => deleteImage(puppy.id, img.id, img.image_url)}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="inline-block px-3 py-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg text-xs cursor-pointer hover:opacity-80 transition">
                      + Add Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(ev) => setNewImages((prev) => ({ ...prev, [puppy.id]: ev.target.files }))}
                      />
                    </label>
                    {newImages[puppy.id] && newImages[puppy.id]!.length > 0 && (
                      <span className="ml-2 text-xs opacity-50">{newImages[puppy.id]!.length} file(s) selected</span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => saveEdits(puppy.id)}
                      disabled={saving === puppy.id}
                      className="px-5 py-2 bg-[var(--accent)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
                    >
                      {saving === puppy.id ? "Saving…" : "Save Changes"}
                    </button>
                    <button onClick={() => setExpanded(null)} className="px-5 py-2 rounded-lg text-sm bg-stone-200 dark:bg-stone-700 hover:opacity-80 transition">
                      Cancel
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
        {puppies.length === 0 && <p className="opacity-60">No puppies yet.</p>}
      </div>
    </div>
  );
}
