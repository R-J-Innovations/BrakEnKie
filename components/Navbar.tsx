"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/contexts/CartContext";

const links = [
  { href: "/available",  label: "Available" },
  { href: "/frenchies",  label: "Our Frenchies" },
  { href: "/about",      label: "Our Story" },
  { href: "/shop",       label: "Frenchie Merch" },
  { href: "/contact",    label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Close menu on navigation
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--accent)]/10 backdrop-blur-md bg-[var(--nav)]/90 transition-colors duration-300">
        <div className="flex justify-between items-center px-6 md:px-8 max-w-7xl mx-auto">

          <Link href="/" className="flex items-center">
            <Image
              src="/Images/Logo.png"
              alt="BrakEnKie"
              width={120}
              height={48}
              className="object-contain h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-x-8 items-center text-[11px] tracking-[0.22em] uppercase font-sans">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="opacity-45 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              >
                {label}
              </Link>
            ))}
            <Link href="/cart" className="relative opacity-45 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[var(--accent)] text-black text-[9px] font-sans font-bold flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + burger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
            >
              <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[8.5px]" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[8.5px]" : ""}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--bg)] border-l border-[var(--accent)]/12 flex flex-col transition-transform duration-400 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--accent)]/10">
            <span className="text-xl font-serif tracking-[0.12em] uppercase font-light">Menu</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="opacity-40 hover:opacity-100 transition-opacity text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col px-8 py-10 gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] tracking-[0.3em] uppercase font-sans opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="text-[13px] tracking-[0.3em] uppercase font-sans opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 flex items-center gap-2"
            >
              Cart
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[9px] font-bold flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Decorative gold line */}
          <div className="mx-8 h-px bg-[var(--accent)]/15" />
        </div>
      </div>
    </>
  );
}
