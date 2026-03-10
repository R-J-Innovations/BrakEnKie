"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [heroUrl, setHeroUrl] = useState("/Images/hero.jpeg");

  // Lock page scroll — hero is the entire viewport
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

  return (
    <main className="relative h-[calc(100svh-57px)] overflow-hidden">

      {/* Full-bleed hero image */}
      <Image
        src={heroUrl}
        alt="BrakEnKie French Bulldogs"
        fill
        className="object-cover object-center"
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

          <p className="text-[11px] tracking-[0.55em] uppercase text-white mb-8 font-sans drop-shadow-md">
            Cradle of Humankind &middot; South Africa
          </p>

          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="h-px w-20 bg-[var(--accent)]/50" />
            <div className="w-1.5 h-1.5 bg-[var(--accent)]/60 rotate-45 flex-shrink-0" />
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

      {/* Footer overlaid at the bottom of the hero */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--bg)]/80 backdrop-blur-md border-t border-[var(--accent)]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-[11px] tracking-[0.3em] uppercase opacity-25 font-sans">
            &copy; {new Date().getFullYear()} BrakEnKie. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com"
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
              href="https://www.instagram.com"
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
