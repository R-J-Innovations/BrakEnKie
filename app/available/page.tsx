"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PuppyCard from "@/components/PuppyCard";

export default function AvailablePage() {
  const [puppies, setPuppies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPuppies() {
      const { data } = await supabase
        .from("puppies")
        .select("*, puppy_images (image_url)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (data) setPuppies(data);
    }
    fetchPuppies();
  }, []);

  return (
    <main>
      <section className="px-6 py-24 max-w-6xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-20">
          <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
            Our Puppies
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Available Now</h1>
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="h-px w-16 bg-[var(--accent)]/35" />
            <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
            <div className="h-px w-16 bg-[var(--accent)]/35" />
          </div>
          <p className="opacity-45 max-w-md mx-auto leading-relaxed text-base">
            Current availability changes quickly. If you&apos;d like to reserve, please request a
            private consultation.
          </p>
        </div>

        {puppies.length === 0 ? (
          <p className="text-center opacity-25 py-20 tracking-[0.3em] uppercase text-[11px] font-sans">
            No puppies available right now. Check back soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {puppies.map((puppy) => (
              <PuppyCard key={puppy.id} puppy={puppy} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
