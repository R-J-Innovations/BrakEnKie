"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PuppyGallery from "@/components/PuppyGallery";

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

    if (loading) return <div className="p-10">Loading...</div>;
    if (!puppy) return <div className="p-10">Puppy not found.</div>;

    return (
        <div className="min-h-screen p-6 sm:p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif mb-6">{puppy.name}</h1>

            <div className="flex flex-col items-center mb-8">
                {puppy.puppy_images?.length ? (
                    <PuppyGallery images={puppy.puppy_images} />
                ) : (
                    <img
                        src="https://placehold.co/600x600"
                        alt="No images"
                        className="w-64 h-64 object-cover rounded-lg border"
                    />
                )}
            </div>

            <div className="mb-2 text-lg">
                <span className="font-semibold">Gender:</span> {puppy.gender}
            </div>
            <div className="mb-2 text-lg">
                <span className="font-semibold">Color:</span> {puppy.color}
            </div>
            {puppy.dob && (
                <div className="mb-2 text-lg">
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {new Date(puppy.dob).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            )}
            <div className="mb-2 text-lg">
                <span className="font-semibold">Description:</span> {puppy.description}
            </div>
            <div className="mb-2 text-lg">
                <span className="font-semibold">Status:</span> {puppy.status}
            </div>
        </div>
    );
}