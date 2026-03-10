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
    <main className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />
      <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-yellow-200/50 dark:bg-yellow-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[10%] w-72 h-72 rounded-full bg-amber-200/50 dark:bg-amber-900/20 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-6">
          Cradle of Humankind &middot; South Africa
        </p>
        <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-tight">
          BrakEnKie
        </h1>
        <p className="text-xl opacity-60 mb-12 max-w-xl mx-auto leading-relaxed">
          Premium French Bulldogs raised with love on our 5-hectare farm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/available"
            className="px-8 py-4 bg-[var(--accent)] rounded-xl font-medium text-black hover:opacity-90 transition-opacity"
          >
            View Available Puppies
            {availableCount !== null && availableCount > 0 && (
              <span className="ml-2 bg-black/20 text-black text-xs px-2 py-0.5 rounded-full">
                {availableCount}
              </span>
            )}
          </Link>
          <Link
            href="/process"
            className="px-8 py-4 rounded-xl border border-current font-medium opacity-60 hover:opacity-100 transition-opacity"
          >
            Reserve a Puppy
          </Link>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-6 justify-center text-sm opacity-40">
          <Link href="/about" className="hover:opacity-100 transition-opacity">Our Story</Link>
          <Link href="/shop" className="hover:opacity-100 transition-opacity">Shop</Link>
          <Link href="/education" className="hover:opacity-100 transition-opacity">Care Guide</Link>
          <Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
        </div>
      </div>
    </main>
  );
}
