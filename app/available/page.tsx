"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PuppyCard from "@/components/PuppyCard";

export default function AvailablePage() {
  const [puppies, setPuppies] = useState<any[]>([]);
  const [previous, setPrevious] = useState<any[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll — pauses on hover
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let paused = false;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    const id = setInterval(() => {
      if (paused || !el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 1;
      }
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

      {/* Previous Puppies carousel */}
      {previous.length > 0 && (
        <section className="py-20 border-t border-[var(--accent)]/10">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-5">
              <div className="h-px w-10 bg-[var(--accent)]/35" />
              <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] font-sans opacity-70">
                Previous Puppies
              </p>
              <div className="h-px w-10 bg-[var(--accent)]/35" />
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto pb-4"
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
                      <img
                        src={img}
                        alt={puppy.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
