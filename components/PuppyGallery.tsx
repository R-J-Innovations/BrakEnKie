"use client";

import "./PuppyGallery.css";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    setActiveIndex(0);
  }, [safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <div className="options">
      {safeImages.map((img, i) => (
        <div
          key={img.image_url + i}
          className={`option ${activeIndex === i ? "active" : ""}`}
          style={
            { "--optionBackground": `url(${img.image_url})` } as React.CSSProperties
          }
          onClick={() => setActiveIndex(i)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setActiveIndex(i);
          }}
          aria-label={`View image ${i + 1}`}
        >
          <div className="shadow"></div>
        </div>
      ))}
    </div>
  );
}
