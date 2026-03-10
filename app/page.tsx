"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [availableCount, setAvailableCount] = useState<number | null>(null);

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
    <main className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Warm gradient base — uses CSS vars so dark mode just works */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg) 0%, var(--card) 50%, var(--bg) 100%)" }} />

      {/* Large floating orbs — always warm gold, subtle enough for both modes */}
      <div className="absolute top-[-8%] right-[-4%] w-[650px] h-[650px] rounded-full bg-[var(--accent)]/10 blur-[110px] animate-float pointer-events-none" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[750px] h-[750px] rounded-full bg-[var(--accent)]/8 blur-[130px] animate-float-alt pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[420px] h-[420px] rounded-full bg-[var(--accent)]/6 blur-[90px] animate-drift pointer-events-none" />

      {/* Thin vertical gold lines */}
      <div className="absolute top-16 left-10 w-px h-28 bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent hidden md:block" />
      <div className="absolute bottom-16 right-10 w-px h-28 bg-gradient-to-b from-transparent via-[var(--accent)]/30 to-transparent hidden md:block" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-8 font-sans opacity-75">
          Cradle of Humankind &middot; South Africa
        </p>

        <h1 className="text-7xl md:text-[9rem] font-serif font-light mb-8 leading-[0.88] tracking-tight">
          Brak<em>En</em>Kie
        </h1>

        <div className="flex items-center justify-center gap-5 mb-10">
          <div className="h-px w-20 bg-[var(--accent)]/40" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/50 rotate-45 flex-shrink-0" />
          <div className="h-px w-20 bg-[var(--accent)]/40" />
        </div>

        <p className="text-xl md:text-2xl opacity-45 mb-14 max-w-xl mx-auto leading-relaxed font-light">
          Premium French Bulldogs raised with love on our 5-hectare farm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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
          <Link
            href="/process"
            className="px-10 py-4 border border-current font-sans text-[11px] tracking-[0.25em] uppercase opacity-45 hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300"
          >
            Reserve a Puppy
          </Link>
        </div>

        <div className="flex flex-wrap gap-8 justify-center text-[11px] tracking-[0.3em] uppercase opacity-30 font-sans">
          <Link href="/about" className="hover:opacity-70 hover:text-[var(--accent)] transition-all duration-300">Our Story</Link>
          <Link href="/shop" className="hover:opacity-70 hover:text-[var(--accent)] transition-all duration-300">Shop</Link>
          <Link href="/education" className="hover:opacity-70 hover:text-[var(--accent)] transition-all duration-300">Care Guide</Link>
          <Link href="/contact" className="hover:opacity-70 hover:text-[var(--accent)] transition-all duration-300">Contact</Link>
        </div>

      </div>
    </main>
  );
}
