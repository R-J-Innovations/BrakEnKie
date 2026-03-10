"use client";

import { useState } from "react";

interface Puppy {
  image_url: string;
  name: string;
  description: string;
}

interface Props {
  puppies: Puppy[];
}

export default function PuppyGallery({ puppies }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
      <div className="options">
        {puppies.map((puppy, i) => (
            <div
                key={i}
                className={`option ${activeIndex === i ? "active" : ""}`}
                style={{ "--optionBackground": `url(${puppy.image_url})` } as React.CSSProperties}
                onClick={() => setActiveIndex(i)}
            >
              <div className="shadow"></div>
              <div className="label">
                <div className="icon">
                  <i className="fas fa-paw"></i>
                </div>
                <div className="info">
                  <div className="main">{puppy.name}</div>
                  <div className="sub">{puppy.description}</div>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
}