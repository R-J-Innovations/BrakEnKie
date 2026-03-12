"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PackMember = {
  id: string;
  name: string;
  color: string | null;
  image_url: string | null;
};

export default function FrenciesPage() {
  const [pack, setPack] = useState<PackMember[]>([]);

  useEffect(() => {
    async function fetchPack() {
      const { data } = await supabase
        .from("pack")
        .select("id, name, color, image_url")
        .order("sort_order", { ascending: true });
      if (data) setPack(data);
    }
    fetchPack();
  }, []);

  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          The Pack
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Meet the Frenchies</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <span className="text-xs opacity-40">🐾</span>
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <div className="flex justify-center gap-5 mt-6 mb-6">
          <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
        <p className="opacity-45 text-base font-light max-w-md mx-auto leading-relaxed">
          They are my pack — my kids, my friends, my family, my Frenchies.
        </p>
      </div>

      {/* Grid */}
      {pack.length === 0 ? (
        <p className="text-center opacity-25 py-20 tracking-[0.3em] uppercase text-[11px] font-sans">
          Loading the pack&hellip;
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pack.map(({ id, name, color, image_url }) => (
            <div
              key={id}
              className="group bg-[var(--card)] border border-[var(--accent)]/10 overflow-hidden hover:border-[var(--accent)]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(184,147,90,0.1)] transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                {image_url ? (
                  <img
                    src={image_url}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--card)] gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-15">
                      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                      <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                      <path d="M8 14v.5"/><path d="M16 14v.5"/>
                      <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
                      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.683 7.582 21 12 21s8-2.317 8-6.444c0-1.076-.232-2.092-.7-3"/>
                    </svg>
                    <span className="text-[10px] tracking-[0.3em] uppercase opacity-20 font-sans">Photo coming soon</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-5 border-t border-[var(--accent)]/10">
                <div className="h-px w-6 bg-[var(--accent)]/40 mb-4 group-hover:w-10 transition-all duration-500" />
                <h2 className="font-serif text-xl font-light">{name}</h2>
                {color && <p className="text-[10px] tracking-[0.25em] uppercase opacity-40 font-sans mt-1">{color}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
