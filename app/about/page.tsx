export default function About() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Est. 2022
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Our Story</h1>
        <div className="flex items-center justify-center gap-5">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <span className="text-xs opacity-40">🐾</span>
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <div className="flex justify-center gap-5 mt-6 mb-6">
          <a href="https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/brak_en_kie_frenchbulldogs?igsh=MTcyYThqanIwdm56ZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      <div className="space-y-16">

        <section>
          <p className="text-xl md:text-2xl leading-relaxed opacity-65 font-light">
            Every time I take the Frenchies for a walk on our 5-hectare farm in the beautiful
            landscape in the Cradle of Humankind, I keep wondering to myself, &ldquo;how does
            the world see us?&rdquo; Because to me, it&apos;s a big deal that we&apos;re understood.
          </p>
        </section>

        <div className="h-px bg-[var(--accent)]/10" />

        <section>
          <p className="text-xl md:text-2xl leading-relaxed opacity-65 font-light">
            I wanted to type a long post to explain our daily lives and what makes us different,
            then deleted it and thought — these pictures speak so much for those willing to listen.
          </p>
        </section>

        {/* Quote section */}
        <section className="bg-[var(--card)] border border-[var(--accent)]/12 p-12 md:p-16 text-center">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[var(--accent)] mb-8 font-sans opacity-70">
            A Manifesto
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-10">Be More DOG</h2>

          <blockquote className="space-y-3 text-lg opacity-55 leading-relaxed font-light italic max-w-sm mx-auto">
            <p>A dog is talking to strangers.</p>
            <p>A dog is going outside.</p>
            <p>A dog is seeking the warm spot.</p>
            <p>A dog is surrendering to the chaos.</p>
            <p>A dog is silly grinning.</p>
            <p>A dog is going easy.</p>
            <p>A dog is seeing your best side.</p>
            <p>A dog is loving unconditional every single time&hellip;</p>
          </blockquote>

          <div className="h-px w-16 bg-[var(--accent)]/30 mx-auto mt-10 mb-6" />
          <p className="text-[11px] tracking-[0.4em] uppercase opacity-30 font-sans">
            From my Frenchie family to yours.
          </p>
        </section>
      </div>
    </main>
  );
}
