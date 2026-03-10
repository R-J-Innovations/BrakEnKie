import Image from "next/image";

const pack: { name: string; image: string | null }[] = [
  { name: "Boss",      image: "/Images/boss.jpeg" },
  { name: "Ava Grey",  image: null },
  { name: "Weasley",   image: "/Images/weasley.jpeg" },
  { name: "Chockie",   image: "/Images/chockie.jpeg" },
  { name: "LuLu",      image: null },
  { name: "Laaitie",   image: "/Images/laaitie.jpeg" },
  { name: "Jasmin",    image: null },
  { name: "Mirabelle", image: "/Images/mirabelle.jpeg" },
  { name: "Portia",    image: null },
];

export default function FrenciesPage() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          The Pack
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Meet the Frenchies</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <p className="opacity-45 text-base font-light max-w-md mx-auto leading-relaxed">
          They are my pack — my kids, my friends, my family, my Frenchies.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pack.map(({ name, image }) => (
          <div
            key={name}
            className="group bg-[var(--card)] border border-[var(--accent)]/10 overflow-hidden hover:border-[var(--accent)]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(184,147,90,0.1)] transition-all duration-500"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--card)] gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-15">
                    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
                    <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
                    <path d="M8 14v.5"/>
                    <path d="M16 14v.5"/>
                    <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.683 7.582 21 12 21s8-2.317 8-6.444c0-1.076-.232-2.092-.7-3"/>
                  </svg>
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-20 font-sans">Photo coming soon</span>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="px-6 py-5 border-t border-[var(--accent)]/10">
              <div className="h-px w-6 bg-[var(--accent)]/40 mb-4 group-hover:w-10 transition-all duration-500" />
              <h2 className="font-serif text-xl font-light">{name}</h2>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
