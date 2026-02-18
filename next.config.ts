import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "iigbnzynyeaomktfqvle.supabase.co" // your Supabase domain
    ],
  },
};

export default nextConfig;
