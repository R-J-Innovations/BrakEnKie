"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PuppyGallery from "@/components/PuppyGallery";
import Link from "next/link";

interface PuppyImage {
  image_url: string;
}
interface Puppy {
  id: string;
  name: string;
  gender: string;
  color: string;
  dob: string | null;
  description: string;
  status: string;
  puppy_images: PuppyImage[];
}

export default function PuppyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [puppy, setPuppy] = useState<Puppy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPuppy() {
      setLoading(true);
      const { data, error } = await supabase
        .from("puppies")
        .select("*, puppy_images (image_url)")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (error) {
        router.push("/available");
        return;
      }

      setPuppy(data);
      setLoading(false);
    }

    if (id) fetchPuppy();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-25 font-sans animate-pulse">
          Loading&hellip;
        </p>
      </div>
    );

  if (!puppy)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[11px] tracking-[0.45em] uppercase opacity-25 font-sans">
          Puppy not found.
        </p>
      </div>
    );

  return (
    <main className="min-h-screen px-6 py-16 max-w-6xl mx-auto">

      <Link
        href="/available"
        className="text-[11px] tracking-[0.3em] uppercase opacity-35 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 mb-14 inline-block font-sans"
      >
        &larr; Available Puppies
      </Link>

      <div className="grid md:grid-cols-2 gap-16 mt-4">

        {/* Gallery */}
        <div>
          {puppy.puppy_images?.length ? (
            <PuppyGallery images={puppy.puppy_images} />
          ) : (
            <div className="aspect-square bg-[var(--card)] border border-[var(--accent)]/10 flex items-center justify-center">
              <span className="text-[11px] tracking-[0.3em] uppercase opacity-20 font-sans">No Images</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-[11px] tracking-[0.5em] uppercase text-[var(--accent)] mb-4 font-sans opacity-75">
            {puppy.gender} &bull; {puppy.color}
          </p>

          <h1 className="text-5xl md:text-6xl font-serif font-light mb-4">{puppy.name}</h1>

          {puppy.dob && (
            <p className="text-sm opacity-35 mb-8 tracking-wide font-sans">
              Born{" "}
              {new Date(puppy.dob).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="h-px bg-[var(--accent)]/12 mb-8" />

          <p className="opacity-55 leading-relaxed mb-8 text-lg font-light">{puppy.description}</p>

          <div className="inline-flex items-center gap-3 mb-10">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                puppy.status === "available"
                  ? "bg-emerald-500"
                  : puppy.status === "reserved"
                  ? "bg-[var(--accent)]"
                  : "bg-stone-400"
              }`}
            />
            <span className="text-[11px] tracking-[0.25em] uppercase opacity-45 font-sans">
              {puppy.status}
            </span>
          </div>

          <a
            href={`https://wa.me/27XXXXXXXXX?text=Hi%20I%20am%20interested%20in%20${puppy.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-8 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.3em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
          >
            Enquire via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
