"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--accent)]/15">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="max-w-xs">
            <h3 className="font-serif text-2xl font-light tracking-[0.1em] uppercase mb-4">
              BrakEnKie
            </h3>
            <p className="text-sm opacity-40 leading-relaxed tracking-wide">
              French Bulldogs raised with love on our farm in the Cradle of Humankind, South Africa.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-[11px] tracking-[0.25em] uppercase font-sans">
            <Link href="/available" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300">Available</Link>
            <Link href="/frenchies" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300">Our Frenchies</Link>
            <Link href="/about" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300">Our Story</Link>
            <Link href="/shop" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300">Frenchie merch</Link>
            <Link href="/contact" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300">Contact</Link>
          </nav>
        </div>

        <div className="h-px bg-[var(--accent)]/10 mb-8" />

        <p className="text-[11px] tracking-[0.3em] uppercase opacity-25 font-sans">
          &copy; {year} BrakEnKie. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
