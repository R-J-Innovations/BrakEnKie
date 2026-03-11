"use client";
import { useEffect, useRef } from "react";

interface Props {
  /** Path relative to private/images/ — served through /api/image */
  localPath?: string;
  /** Full Supabase storage URL — proxied through /api/image */
  externalUrl?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

function applyWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fontSize = Math.max(12, Math.floor(Math.min(w, h) / 10));
  ctx.save();
  ctx.font = `${fontSize}px serif`;
  ctx.fillStyle = "#B8935A";
  ctx.globalAlpha = 0.18;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const step = fontSize * 5;
  for (let row = -h; row < h * 2; row += step) {
    for (let col = -w; col < w * 2; col += step) {
      ctx.save();
      ctx.translate(col, row);
      ctx.rotate(-Math.PI / 5);
      ctx.fillText("BrakEnKie", 0, 0);
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  const sx = (cw - sw) / 2;
  const sy = (ch - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

export default function WatermarkedImage({
  localPath,
  externalUrl,
  alt,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const apiUrl = localPath
    ? `/api/image?path=${encodeURIComponent(localPath)}`
    : externalUrl
    ? `/api/image?url=${encodeURIComponent(externalUrl)}`
    : null;

  useEffect(() => {
    if (!apiUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    imgRef.current = img;

    const render = () => {
      if (!imgRef.current?.complete || !imgRef.current.naturalWidth) return;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      if (!cw || !ch) return;
      canvas.width = cw;
      canvas.height = ch;
      drawCover(ctx, imgRef.current, cw, ch);
      applyWatermark(ctx, cw, ch);
    };

    img.onload = render;
    img.src = apiUrl;

    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      imgRef.current = null;
    };
  }, [apiUrl]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
