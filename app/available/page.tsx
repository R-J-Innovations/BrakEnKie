"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PuppyCard from "@/components/PuppyCard";

export default function AvailablePage() {
  const [puppies, setPuppies] = useState<any[]>([]);
  const [previous, setPrevious] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll — bounces left↔right, pauses on hover
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let paused = false;
    let direction = 1;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    const id = setInterval(() => {
      if (paused || !el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      if (el.scrollLeft >= maxScroll) direction = -1;
      if (el.scrollLeft <= 0) direction = 1;
      el.scrollLeft += direction;
    }, 20);
    return () => {
      clearInterval(id);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    async function fetchPuppies() {
      const { data } = await supabase
        .from("puppies")
        .select("*, puppy_images (image_url)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (data) setPuppies(data);
    }

    async function fetchPrevious() {
      const { data } = await supabase
        .from("puppies")
        .select("*, puppy_images (image_url)")
        .eq("status", "sold")
        .eq("featured", true)
        .order("created_at", { ascending: false });
      if (data) setPrevious(data);
    }

    fetchPuppies();
    fetchPrevious();
  }, []);

  return (
    <main>
      {/* Available section */}
      <section className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

        <div className="text-center mb-20">
          <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
            Our Puppies
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Available Now</h1>
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="h-px w-16 bg-[var(--accent)]/35" />
            <span className="text-xs opacity-40">🐾</span>
            <div className="h-px w-16 bg-[var(--accent)]/35" />
          </div>
          <div className="flex justify-center gap-5 mt-6 mb-8">
            <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
          <p className="opacity-45 max-w-md mx-auto leading-relaxed text-base">
            Current availability changes quickly. If you&apos;d like to reserve, kindly reach out via whatsapp or DM us on Instagram.
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

      {/* Previous Puppies carousel */}
      {previous.length > 0 && (
        <section className="py-20 border-t border-[var(--accent)]/10">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-5">
              <div className="h-px w-10 bg-[var(--accent)]/35" />
              <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] font-sans opacity-70">
                🐾 Puppies that found their fur ever homes 🐾
              </p>
              <div className="h-px w-10 bg-[var(--accent)]/35" />
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto pb-4 px-6 lg:px-16"
            style={{ scrollbarWidth: "none" }}
          >
            {previous.map((puppy) => {
              const img = puppy.puppy_images?.[0]?.image_url;
              return (
                <div
                  key={puppy.id}
                  className="snap-start flex-shrink-0 w-56 md:w-64 group bg-[var(--card)] border border-[var(--accent)]/10 overflow-hidden hover:border-[var(--accent)]/25 transition-all duration-500"
                >
                  <div className="aspect-square overflow-hidden bg-[var(--card)]">
                    {img ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-15">
                        <span className="text-[10px] tracking-[0.3em] uppercase font-sans">No photo</span>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-4 border-t border-[var(--accent)]/10">
                    <h3 className="font-serif text-base font-light">{puppy.name}</h3>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-30 font-sans mt-1">{puppy.color}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

    </main>
  );
}
