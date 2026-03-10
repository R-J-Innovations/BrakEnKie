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
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-4 text-center">Available Puppies</h1>
        <p className="text-center opacity-60 mb-12 max-w-xl mx-auto">
          Current availability changes quickly. If you&apos;d like to reserve, please request a
          private consultation.
        </p>
        {puppies.length === 0 ? (
          <p className="text-center opacity-40 py-20">No puppies available right now. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {puppies.map((puppy) => (
              <PuppyCard key={puppy.id} puppy={puppy} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
