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

      {/* Client Attestation */}
      <section className="py-24 px-6 lg:px-16 max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-10 bg-[var(--accent)]/35" />
            <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] font-sans opacity-70">
              From Our Families
            </p>
            <div className="h-px w-10 bg-[var(--accent)]/35" />
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-start gap-0">

          {/* Photo — overlaps the card on desktop */}
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:mr-[-3rem] mx-auto md:mx-0">
            {/* Soft gold glow behind the image */}
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            {/* Outer ring accent */}
            <div
              className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none"
              style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
            />
            {/* Image with arch top */}
            <div
              className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]"
              style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}
            >
              <img
                src="/api/image?path=attestation%2FElton%20John.jpeg"
                alt="Happy client"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote card */}
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pl-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">

            {/* Decorative quote mark */}
            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">
              &ldquo;
            </div>

            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />

            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Thank you Brak & Kie for this beautiful gift of a brand new family member!
              Elton Johan has changed our life and now we cannot imagine our little family without him!
              We absolutely adore and love our Frenchie!
            </p>

            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">
                Louise Volschenk (Mommy club van die Hoofstad)
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">
                Johannesburg &middot; 2025
              </p>
            </div>

          </div>

        </div>

        {/* Lanny — Dubai */}
        <div className="relative flex flex-col md:flex-row-reverse items-start gap-0 mt-20">

          {/* Photo — overlaps from the right on desktop */}
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:ml-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div
              className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none"
              style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
            />
            <div
              className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]"
              style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}
            >
              <img
                src="/api/image?path=attestation%2FLanny.jpeg"
                alt="Lanny in Dubai"
                className="w-full h-full object-cover"
                
              />
            </div>
          </div>

          {/* Quote card */}
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pr-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">

            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">
              &ldquo;
            </div>

            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />

            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              We are so happy with our boy Lanny! He is the first BrakEnKie puppy to make his home
              in Dubai. He has settled in
              beautifully and we absolutely adore him.
            </p>

            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">
                Megan Zofka
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">
                Dubai &middot; 2025
              </p>
            </div>

          </div>

        </div>

        {/* Ghana — Bloubergstrand */}
        <div className="relative flex flex-col md:flex-row items-start gap-0 mt-20">

          {/* Photo — overlaps from the left on desktop */}
          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:mr-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div
              className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none"
              style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
            />
            <div
              className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]"
              style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}
            >
              <img
                src="/api/image?path=attestation%2FGhana.jpeg"
                alt="Ghana living his best life"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Quote card */}
          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pl-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">

            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">
              &ldquo;
            </div>

            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />

            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Our boy Ghana is living his absolute best life in Bloubergstrand. From day one he has
              been the heart of our home — full of character, joy, and endless Frenchie charm.
              Follow his adventures with Kenya over on Instagram.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">
                Jako Venter
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30">
                Bloubergstrand &middot; 2023
              </p>
              <a
                href="https://www.instagram.com/frenchietales_kenya_and_ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-1 text-[10px] tracking-[0.2em] uppercase font-sans opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @frenchietales_kenya_and_ghana
              </a>
            </div>

          </div>

        </div>

        {/* Loodle — Chantel Cronje */}
        <div className="relative flex flex-col md:flex-row-reverse items-start gap-0 mt-20">

          <div className="relative z-10 flex-shrink-0 w-56 md:w-64 md:ml-[-3rem] mx-auto md:mx-0">
            <div className="absolute inset-0 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-[var(--accent)]/20 blur-2xl scale-110 pointer-events-none" />
            <div
              className="absolute inset-[-5px] border border-[var(--accent)]/25 pointer-events-none"
              style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
            />
            <div
              className="relative overflow-hidden aspect-[3/4] shadow-[0_30px_70px_rgba(0,0,0,0.35),0_0_40px_rgba(184,147,90,0.12)]"
              style={{ borderRadius: "50% 50% 12px 12px / 40% 40% 12px 12px" }}
            >
              <img
                src="/api/image?path=attestation%2FLoodle.jpeg"
                alt="Loodle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="relative flex-1 bg-[var(--card)] border border-[var(--accent)]/15 px-10 md:pr-16 pt-10 pb-10 md:pt-12 mt-0 md:mt-8">

            <div className="absolute top-6 right-8 text-7xl font-serif leading-none text-[var(--accent)]/10 select-none pointer-events-none">
              &ldquo;
            </div>

            <div className="h-px w-8 bg-[var(--accent)]/40 mb-6" />

            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed opacity-80 mb-8">
              Ok soooo hy is cute verby… 😍🤩 ons is mal oor hom…. So baie dankie…. Loodle is verby cute ♥️
            </p>

            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase font-sans text-[var(--accent)] opacity-80">
                Chantel Cronje
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-30 mt-1">
                Vereeniging &middot; 2024
              </p>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}
