import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
      <Link href="/" className="text-xl font-serif tracking-wide">
        BrakEnKie
      </Link>

      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-sm">
        <Link href="/available" className="opacity-60 hover:opacity-100 transition-opacity">
          Available
        </Link>
        <Link href="/process" className="opacity-60 hover:opacity-100 transition-opacity">
          Reservations
        </Link>
        <Link href="/about" className="opacity-60 hover:opacity-100 transition-opacity">
          Our Story
        </Link>
        <Link href="/shop" className="opacity-60 hover:opacity-100 transition-opacity">
          Shop
        </Link>
        <Link href="/education" className="opacity-60 hover:opacity-100 transition-opacity">
          Education
        </Link>
        <Link href="/contact" className="opacity-60 hover:opacity-100 transition-opacity">
          Contact
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
