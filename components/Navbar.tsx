import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      <h1 className="text-xl font-semibold tracking-wide">
        BrakenKie French Bulldogs
      </h1>

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>
        <Link href="/available">Available</Link>
        <Link href="/about">About</Link>
        <Link href="/education">Education</Link>
        <Link href="/contact">Contact</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
