"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const COLLECTION_IMAGES = [
  "/collection/1.jpeg",
  "/collection/2.jpeg",
  "/collection/3.jpeg",
  "/collection/4.jpeg",
];

export default function Home() {
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [heroUrl, setHeroUrl] = useState("/Images/hero.jpeg");
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchHero() {
      const { data } = await supabase
        .from("site_config")
        .select("value")
        .eq("key", "hero_image_url")
        .single();
      if (data?.value) setHeroUrl(data.value);
    }
    fetchHero();
  }, []);

  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from("puppies")
        .select("*", { count: "exact", head: true })
        .eq("status", "available");
      if (count !== null) setAvailableCount(count);
    }
    fetchCount();
  }, []);

  // Auto-advance collection carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % COLLECTION_IMAGES.length);
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <main>

      {/* ── Hero ── */}
      <div className="relative h-[calc(100svh-57px)] overflow-hidden">

        {/* Full-bleed hero image — hidden on mobile */}
        <Image
          src={heroUrl}
          alt="BrakEnKie French Bulldogs"
          fill
          className="object-cover object-center hidden sm:block"
          priority
        />

        {/* Gradient overlay — dark at top and bottom for nav/footer legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/55" />

        {/* Gold orb accents */}
        <div className="absolute top-[-8%] right-[-4%] w-[650px] h-[650px] rounded-full bg-[var(--accent)]/10 blur-[110px] animate-float pointer-events-none" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[750px] h-[750px] rounded-full bg-[var(--accent)]/8 blur-[130px] animate-float-alt pointer-events-none" />

        {/* Thin vertical gold lines */}
        <div className="absolute top-16 left-10 w-px h-28 bg-gradient-to-b from-transparent via-[var(--accent)]/40 to-transparent hidden md:block" />
        <div className="absolute bottom-16 right-10 w-px h-28 bg-gradient-to-b from-transparent via-[var(--accent)]/40 to-transparent hidden md:block" />

        {/* Centre content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-6 w-full max-w-4xl mx-auto">

            {/* Logo — shown on mobile only, above location text */}
            <div className="flex justify-center mb-8 sm:hidden">
              <Image
                src="/Images/Logo.png"
                alt="BrakEnKie Logo"
                width={220}
                height={220}
                className="object-contain"
                priority
              />
            </div>

            <p className="text-[11px] tracking-[0.55em] uppercase text-white mb-8 font-sans drop-shadow-md">
              Cradle of Humankind <span className="inline-block align-middle mx-1 opacity-40"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.5c-3.2 0-5.5-1.9-5.5-4.8 0-1.4.7-2.6 1.8-3.5C9.4 8.3 10.7 7.8 12 7.8s2.6.5 3.7 1.4c1.1.9 1.8 2.1 1.8 3.5 0 2.9-2.3 4.8-5.5 4.8z"/><circle cx="7" cy="8" r="1.5"/><circle cx="17" cy="8" r="1.5"/><circle cx="5" cy="11.5" r="1.5"/><circle cx="19" cy="11.5" r="1.5"/></svg></span> South Africa
            </p>

            <div className="flex items-center justify-center gap-5 mb-10">
              <div className="h-px w-20 bg-[var(--accent)]/50" />
              <span className="text-xs opacity-60">🐾</span>
              <div className="h-px w-20 bg-[var(--accent)]/50" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/available"
                className="px-10 py-4 bg-[var(--accent)] font-sans text-[11px] tracking-[0.25em] uppercase text-black hover:bg-[var(--accent-hover)] transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                View Available Puppies
                {availableCount !== null && availableCount > 0 && (
                  <span className="bg-black/20 text-black text-[10px] px-2 py-0.5 rounded-full">
                    {availableCount}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ── Our Collection ── */}
      <section className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-[var(--accent)]">
            Our Collection
          </h2>
          <div className="flex items-center justify-center gap-5">
            <div className="h-px w-16 bg-[var(--accent)]/35" />
            <span className="text-xs opacity-40">🐾</span>
            <div className="h-px w-16 bg-[var(--accent)]/35" />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/7] max-w-4xl mx-auto mb-10">
          {COLLECTION_IMAGES.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === activeSlide ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={`BrakEnKie collection ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          ))}
          {/* Dot indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {COLLECTION_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveSlide(i);
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  intervalRef.current = setInterval(() => {
                    setActiveSlide((prev) => (prev + 1) % COLLECTION_IMAGES.length);
                  }, 3500);
                }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeSlide ? "var(--accent)" : "rgba(255,255,255,0.4)",
                  transform: i === activeSlide ? "scale(1.25)" : "scale(1)",
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block px-10 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg)] border-t border-[var(--accent)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-[11px] tracking-[0.3em] uppercase opacity-25 font-sans">
            &copy; {new Date().getFullYear()} BrakEnKie. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>

        </div>
      </footer>

    </main>
  );
}
