const cards = [
  {
    title: "Availability",
    description: "Ask about current or upcoming litters.",
  },
  {
    title: "Reservations",
    description: "We'll guide you through the full reservation process.",
  },
  {
    title: "Delivery",
    description: "We can discuss safe transport options and timing.",
  },
];

export default function Contact() {
  return (
    <main className="px-6 py-24 max-w-3xl mx-auto">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Get in Touch
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Private Enquiries</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <p className="opacity-45 text-base leading-relaxed font-light max-w-sm mx-auto">
          For availability and reservations, please request a consultation.
          We&apos;ll reply as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[var(--card)] border border-[var(--accent)]/10 p-8 text-center group hover:border-[var(--accent)]/25 transition-all duration-300"
          >
            <div className="w-6 h-px bg-[var(--accent)]/40 mx-auto mb-6 group-hover:w-10 transition-all duration-500" />
            <h3 className="font-serif text-xl font-light mb-3">{card.title}</h3>
            <p className="text-sm opacity-45 leading-relaxed font-sans">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase opacity-35 mb-8 font-sans">
          The quickest way to reach us is via WhatsApp
        </p>
        <a
          href="https://wa.me/27XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.25em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
        >
          Request Consultation on WhatsApp
        </a>
      </div>
    </main>
  );
}
