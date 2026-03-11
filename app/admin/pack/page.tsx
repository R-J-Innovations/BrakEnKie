"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

type PackMember = {
  id: string;
  name: string;
  color: string | null;
  image_url: string | null;
  sort_order: number;
};

const inputCls = "w-full p-2.5 rounded-lg border bg-[var(--bg)] text-[var(--text)] border-black/20 dark:border-white/20 text-sm";

export default function ManagePack() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [pack, setPack] = useState<PackMember[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<PackMember>>>({});

  // Add form
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
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
    const { data } = await supabase.from("pack").select("*").order("sort_order", { ascending: true });
    if (data) setPack(data);
  }

  async function uploadImage(file: File, folder = "pack"): Promise<string | null> {
    const filePath = `${folder}/${uuidv4()}`;
    const { error } = await supabase.storage.from("site-assets").upload(filePath, file);
    if (error) { alert("Image upload failed: " + error.message); return null; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const image_url = file ? await uploadImage(file) : null;
    const { error } = await supabase.from("pack").insert([{
      name: name.trim(),
      color: color.trim() || null,
      image_url,
      sort_order: pack.length,
    }]);
    if (error) alert("Error adding pack member: " + error.message);
    else { setName(""); setColor(""); setFile(null); await fetchPack(); }
    setAdding(false);
  }

  function startEdit(member: PackMember) {
    setExpanded(member.id);
    setEdits((prev) => ({ ...prev, [member.id]: { ...member } }));
  }

  function setField(id: string, field: keyof PackMember, value: any) {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  async function saveEdits(id: string, newFile?: File | null) {
    const e = edits[id];
    if (!e) return;
    setSaving(id);

    let image_url = e.image_url ?? null;
    if (newFile) {
      const uploaded = await uploadImage(newFile);
      if (uploaded) image_url = uploaded;
    }

    await supabase.from("pack").update({
      name: e.name,
      color: e.color || null,
      image_url,
    }).eq("id", id);

    await fetchPack();
    setSaving(null);
    setExpanded(null);
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
        <a href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">← Dashboard</a>
        <h1 className="text-3xl font-serif">Manage The Pack</h1>
      </div>

      <div className="max-w-3xl space-y-10">

        {/* Add new member */}
        <section className="bg-[var(--card)] rounded-2xl p-8">
          <h2 className="font-serif text-xl mb-6">Add Pack Member</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs opacity-50 mb-1">Name</label>
                <input className={inputCls} placeholder="e.g. Bella" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs opacity-50 mb-1">Colour / Genetics</label>
                <input className={inputCls} placeholder="e.g. Blue & Tan, Fluffy carrier" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs opacity-50 mb-1">Photo (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
            </div>
            <button type="submit" disabled={adding} className="px-6 py-3 bg-[var(--accent)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30">
              {adding ? "Adding…" : "Add to Pack"}
            </button>
          </form>
        </section>

        {/* Current pack */}
        <section>
          <h2 className="font-serif text-xl mb-4">Current Pack</h2>
          <div className="space-y-4">
            {pack.map((member) => {
              const isOpen = expanded === member.id;
              const e = edits[member.id] ?? member;
              return (
                <div key={member.id} className="bg-[var(--card)] rounded-xl shadow overflow-hidden">

                  {/* Row */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 flex-shrink-0">
                      {member.image_url
                        ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center opacity-20 text-xs">No photo</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg leading-tight">{member.name}</p>
                      {member.color && <p className="text-xs opacity-50 mt-0.5">{member.color}</p>}
                    </div>
                    <button
                      onClick={() => isOpen ? setExpanded(null) : startEdit(member)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-200 dark:bg-stone-700 hover:opacity-80 transition flex-shrink-0"
                    >
                      {isOpen ? "Close" : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Edit panel */}
                  {isOpen && (
                    <EditMemberPanel
                      e={e}
                      member={member}
                      saving={saving === member.id}
                      onField={(field, val) => setField(member.id, field, val)}
                      onSave={(newFile) => saveEdits(member.id, newFile)}
                      onCancel={() => setExpanded(null)}
                      inputCls={inputCls}
                    />
                  )}
                </div>
              );
            })}
            {pack.length === 0 && <p className="opacity-40 text-sm">No pack members yet.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}

function EditMemberPanel({ e, member, saving, onField, onSave, onCancel, inputCls }: {
  e: Partial<PackMember>;
  member: PackMember;
  saving: boolean;
  onField: (field: keyof PackMember, val: any) => void;
  onSave: (file?: File | null) => void;
  onCancel: () => void;
  inputCls: string;
}) {
  const [newFile, setNewFile] = useState<File | null>(null);

  return (
    <div className="border-t border-black/10 dark:border-white/10 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs opacity-50 mb-1">Name</label>
          <input className={inputCls} value={e.name ?? ""} onChange={(ev) => onField("name", ev.target.value)} />
        </div>
        <div>
          <label className="block text-xs opacity-50 mb-1">Colour / Genetics</label>
          <input className={inputCls} placeholder="e.g. Blue & Tan, Fluffy carrier" value={e.color ?? ""} onChange={(ev) => onField("color", ev.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs opacity-50 mb-2">Photo</label>
        {member.image_url && (
          <img src={member.image_url} alt={member.name} className="w-20 h-20 object-cover rounded-lg mb-3" />
        )}
        <label className="inline-block px-3 py-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg text-xs cursor-pointer hover:opacity-80 transition">
          {member.image_url ? "Replace Photo" : "Add Photo"}
          <input type="file" accept="image/*" className="hidden" onChange={(ev) => setNewFile(ev.target.files?.[0] ?? null)} />
        </label>
        {newFile && <span className="ml-2 text-xs opacity-50">{newFile.name}</span>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(newFile)}
          disabled={saving}
          className="px-5 py-2 bg-[var(--accent)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-lg text-sm bg-stone-200 dark:bg-stone-700 hover:opacity-80 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
