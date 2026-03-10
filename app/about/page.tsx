export default function About() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Est. Cradle of Humankind
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Our Story</h1>
        <div className="flex items-center justify-center gap-5">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
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
