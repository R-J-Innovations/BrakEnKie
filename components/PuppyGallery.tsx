"use client";

import { useMemo, useState } from "react";

export type PuppyGalleryImage = {
  image_url: string;
};

interface Props {
  images: PuppyGalleryImage[];
}

export default function PuppyGallery({ images }: Props) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter((i) => !!i?.image_url) : []),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (safeImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square overflow-hidden bg-[var(--card)]">
        <img
          src={safeImages[activeIndex].image_url}
          alt={`Image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {safeImages.map((img, i) => (
            <button
              key={img.image_url + i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === i
                  ? "border-[var(--accent)]"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={img.image_url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
