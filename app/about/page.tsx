const packNames = [
  "Ava Grey",
  "Weasley",
  "Chockie",
  "LuLu",
  "Laaitie",
  "Jasmin",
  "Mirabelle",
  "Portia",
];

export default function About() {
  return (
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-5xl font-serif mb-4 text-center">Our Story</h1>
      <p className="text-center opacity-50 mb-16 tracking-widest text-sm uppercase">
        BrakEnKie &middot; Cradle of Humankind
      </p>

      <div className="space-y-12">
        <section>
          <p className="text-lg leading-relaxed opacity-80">
            Every time I take the Frenchies for a walk on our 5-hectare farm in the beautiful
            landscape in the Cradle of Humankind, I keep wondering to myself, &ldquo;how does
            the world see us?&rdquo; Because to me, it&apos;s a big deal that we&apos;re understood.
          </p>
        </section>

        <section>
          <p className="text-lg leading-relaxed opacity-80">
            I wanted to type a long post to explain our daily lives and what makes us different,
            then deleted it and thought — these pictures speak so much for those willing to listen.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-serif mb-6">Our Pack</h2>
          <p className="text-lg leading-relaxed opacity-80 mb-6">
            Ava Grey, Weasley, Chockie, LuLu, Laaitie, Jasmin, Mirabelle, Portia&hellip; yup,
            that&apos;s them. They are my pack — my kids, my friends, my family, my Frenchies.
          </p>
          <div className="flex flex-wrap gap-3">
            {packNames.map((name) => (
              <span
                key={name}
                className="px-4 py-2 bg-[var(--card)] rounded-full text-sm font-medium border border-black/10 dark:border-white/10"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[var(--card)] rounded-3xl p-10 md:p-14">
          <h2 className="text-3xl font-serif mb-10 text-center">Be More DOG</h2>
          <blockquote className="space-y-4 text-center text-lg opacity-70 leading-relaxed italic">
            <p>A dog is talking to strangers.</p>
            <p>A dog is going outside.</p>
            <p>A dog is seeking the warm spot.</p>
            <p>A dog is surrendering to the chaos.</p>
            <p>A dog is silly grinning.</p>
            <p>A dog is going easy.</p>
            <p>A dog is seeing your best side.</p>
            <p>A dog is loving unconditional every single time&hellip;</p>
          </blockquote>
          <p className="text-center mt-10 opacity-40 text-sm tracking-widest uppercase">
            From my Frenchie family to yours.
          </p>
        </section>
      </div>
    </main>
  );
}
