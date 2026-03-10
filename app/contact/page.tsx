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
    <main className="px-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-5xl font-serif mb-4 text-center">Private Enquiries</h1>
      <p className="text-center opacity-60 mb-16 text-lg leading-relaxed max-w-xl mx-auto">
        For availability and reservations, please request a consultation.
        We&apos;ll reply as soon as possible.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[var(--card)] rounded-2xl p-6 shadow text-center"
          >
            <h3 className="font-serif text-xl mb-2">{card.title}</h3>
            <p className="text-sm opacity-60 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="opacity-50 mb-6 text-sm">
          The quickest way to reach us is via WhatsApp.
        </p>
        <a
          href="https://wa.me/27XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-yellow-500 rounded-xl font-medium text-black hover:opacity-90 transition-opacity"
        >
          Request Consultation on WhatsApp
        </a>
      </div>
    </main>
  );
}
