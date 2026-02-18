"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function AddPuppy() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1️⃣ Create puppy record
    const { data: puppy, error } = await supabase
      .from("puppies")
      .insert([
        {
          name,
          gender,
          color,
          description,
          status: "available",
          featured,
        },
      ])
      .select()
      .single();

    if (error || !puppy) {
      alert("Error creating puppy");
      return;
    }

    const puppyId = puppy.id;

    // 2️⃣ Upload images
    if (images) {
      const uploadPromises = Array.from(images).map(async (file) => {
        const filePath = `puppies/${puppyId}/${uuidv4()}`;
        const { error: uploadError } = await supabase.storage
          .from("puppy-images")
          .upload(filePath, file);
        if (uploadError) {
          alert("Error uploading image: " + file.name);
          return;
        }
        const { data } = supabase.storage
          .from("puppy-images")
          .getPublicUrl(filePath);
        const { error: dbError } = await supabase.from("puppy_images").insert([
          {
            puppy_id: puppyId,
            image_url: data.publicUrl,
          },
        ]);
        if (dbError) {
          alert("Error saving image URL to database: " + file.name);
        }
      });
      await Promise.all(uploadPromises);
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-serif mb-10">Add New Puppy</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <input
          placeholder="Name"
          className="w-full p-3 rounded-lg border"
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="w-full p-3 rounded-lg border"
          onChange={(e) => setGender(e.target.value)}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
        <input
          placeholder="Color"
          className="w-full p-3 rounded-lg border"
          onChange={(e) => setColor(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-3 rounded-lg border"
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured Puppy
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />
        <button className="px-6 py-3 bg-(--accent) rounded-lg text-black">
          Create Puppy
        </button>
      </form>
    </div>
  );
}
