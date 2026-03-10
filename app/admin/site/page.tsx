"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function SiteSettings() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [currentHero, setCurrentHero] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      setSession(session);

      const { data } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "hero_image_url")
        .single();
      if (data?.value) setCurrentHero(data.value);
    }
    init();
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!file) return;
    setLoading(true);
    setSaved(false);

    const filePath = `hero/${uuidv4()}`;
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    await supabase
      .from("site_config")
      .upsert({ key: "hero_image_url", value: urlData.publicUrl });

    setCurrentHero(urlData.publicUrl);
    setFile(null);
    setPreview(null);
    setLoading(false);
    setSaved(true);
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-10">
      <div className="flex items-center gap-4 mb-10">
        <a href="/admin" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
          ← Dashboard
        </a>
        <h1 className="text-3xl font-serif">Site Settings</h1>
      </div>

      <div className="max-w-2xl space-y-10">

        {/* Hero Image */}
        <section className="bg-[var(--card)] rounded-2xl p-8 space-y-6">
          <h2 className="font-serif text-xl">Hero Image</h2>

          {currentHero && (
            <div>
              <p className="text-xs opacity-40 mb-2 uppercase tracking-widest">Current</p>
              <img
                src={currentHero}
                alt="Current hero"
                className="w-full max-h-64 object-cover rounded-xl"
              />
            </div>
          )}

          {preview && (
            <div>
              <p className="text-xs opacity-40 mb-2 uppercase tracking-widest">New (preview)</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl border-2 border-[var(--accent)]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm opacity-50 mb-2">Upload new hero image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!file || loading}
            className="px-6 py-3 bg-[var(--accent)] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {loading ? "Uploading..." : "Save Hero Image"}
          </button>

          {saved && (
            <p className="text-sm text-green-500">Hero image updated successfully.</p>
          )}
        </section>

      </div>
    </div>
  );
}
