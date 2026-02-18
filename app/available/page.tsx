"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PuppyCard from "@/components/PuppyCard";

export default function AvailablePage() {
  const [puppies, setPuppies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPuppies() {
      const { data, error } = await supabase
        .from("puppies")
        .select(`*, puppy_images (image_url)`)
        .eq("status", "available")
        .order("created_at", { ascending: false });
      console.log("DATA:", data);
      if (data) {
        data.forEach((puppy: any) => {
          console.log("puppy_images for", puppy.name, puppy.puppy_images);
        });
      }
      if (error) console.log("ERROR:", error);
      if (data) setPuppies(data);
    }
    fetchPuppies();
  }, []);

  return (
    <main>
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-12 text-center">
          Available Puppies
        </h1>
        <div className="grid md:grid-cols-3 gap-10">
          {puppies.map((puppy) => (
            <PuppyCard key={puppy.id} puppy={{ ...puppy, imageUrl: puppy.image_url }} />
          ))}
        </div>
      </section>
    </main>
  );
}
