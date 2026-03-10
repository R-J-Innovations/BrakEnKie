import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 dark:border-white/10 mt-20 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8">
        <div>
          <h3 className="font-serif text-xl mb-2">BrakEnKie</h3>
          <p className="text-sm opacity-50 max-w-xs leading-relaxed">
            French Bulldogs raised with love on our farm in the Cradle of Humankind, South Africa.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/available" className="opacity-50 hover:opacity-100 transition-opacity">Available</Link>
          <Link href="/process" className="opacity-50 hover:opacity-100 transition-opacity">Reservations</Link>
          <Link href="/about" className="opacity-50 hover:opacity-100 transition-opacity">Our Story</Link>
          <Link href="/shop" className="opacity-50 hover:opacity-100 transition-opacity">Shop</Link>
          <Link href="/education" className="opacity-50 hover:opacity-100 transition-opacity">Education</Link>
          <Link href="/contact" className="opacity-50 hover:opacity-100 transition-opacity">Contact</Link>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/10 dark:border-white/10">
        <p className="text-xs opacity-30">&copy; {year} BrakEnKie. All rights reserved.</p>
      </div>
    </footer>
  );
}
