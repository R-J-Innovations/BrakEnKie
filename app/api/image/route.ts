import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const SUPABASE_HOST = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const localPath = searchParams.get("path");
  const externalUrl = searchParams.get("url");

  // --- Local private file ---
  if (localPath) {
    const normalized = path.normalize(localPath).replace(/^(\.\.(\/|\\|$))+/, "");
    const privateDir = path.join(process.cwd(), "private", "images");
    const fullPath = path.join(privateDir, normalized);

    if (!fullPath.startsWith(privateDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    try {
      const file = await readFile(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : "image/jpeg";
      return new NextResponse(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, no-store",
        },
      });
    } catch {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  // --- External Supabase URL proxy ---
  if (externalUrl) {
    let parsed: URL;
    try {
      parsed = new URL(externalUrl);
    } catch {
      return new NextResponse("Bad request", { status: 400 });
    }

    // Only allow our Supabase storage domain
    if (parsed.hostname !== SUPABASE_HOST) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    try {
      const upstream = await fetch(externalUrl);
      if (!upstream.ok) return new NextResponse("Not found", { status: 404 });

      const blob = await upstream.arrayBuffer();
      const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, no-store",
        },
      });
    } catch {
      return new NextResponse("Upstream error", { status: 502 });
    }
  }

  return new NextResponse("Bad request", { status: 400 });
}
