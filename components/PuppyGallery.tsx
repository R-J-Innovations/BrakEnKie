"use client";

import "./PuppyGallery.css";
import { useEffect, useMemo, useState } from "react";
import WatermarkedImage from "@/components/WatermarkedImage";

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
          onClick={() => setActiveIndex(i)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setActiveIndex(i);
          }}
          aria-label={`View image ${i + 1}`}
        >
          {/* Canvas-rendered watermarked image fills the option div */}
          <WatermarkedImage
            externalUrl={img.image_url}
            alt={`Photo ${i + 1}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          />
          <div className="shadow" style={{ position: "relative", zIndex: 1 }} />
          <div className="label" style={{ zIndex: 2 }}>
            <div className="icon">
              <span aria-hidden="true">🐾</span>
            </div>
            <div className="info">
              <div className="main">Photo {i + 1}</div>
              <div className="sub">
                {activeIndex === i ? "Click other images to view" : ""}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
