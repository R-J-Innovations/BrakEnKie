import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Submit a private enquiry",
    description:
      "Tell us what you're looking for and a bit about your home. We want to understand your lifestyle so we can match the right puppy to your family.",
  },
  {
    number: "02",
    title: "Personal consultation",
    description:
      "We'll chat about timing, expectations, and what to look for in a companion. This is a personal process — no rush, no pressure.",
  },
  {
    number: "03",
    title: "Secure your companion",
    description:
      "Once aligned, we'll confirm availability and guide you through the next steps including deposit and collection or delivery arrangements.",
  },
];

export default function ProcessPage() {
  return (
    <main className="px-6 py-24 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          The Process
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">Private Reservation</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="h-px w-16 bg-[var(--accent)]/35" />
          <div className="w-1.5 h-1.5 bg-[var(--accent)]/40 rotate-45 flex-shrink-0" />
          <div className="h-px w-16 bg-[var(--accent)]/35" />
        </div>
        <p className="opacity-45 max-w-md mx-auto leading-relaxed text-base font-light">
          We keep reservations personal and intentional. Every puppy goes to a home we trust.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-5 mb-16">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-10 items-start p-10 bg-[var(--card)] border border-[var(--accent)]/10 group hover:border-[var(--accent)]/22 transition-all duration-300"
          >
            <span className="text-6xl font-serif font-light text-[var(--accent)] opacity-20 flex-shrink-0 leading-none group-hover:opacity-35 transition-opacity duration-300">
              {step.number}
            </span>
            <div className="pt-2">
              <h3 className="text-xl font-serif font-light mb-3">{step.title}</h3>
              <p className="opacity-50 leading-relaxed text-sm font-sans">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-[var(--card)] border border-[var(--accent)]/10 p-14">
        <p className="text-[11px] tracking-[0.45em] uppercase text-[var(--accent)] mb-6 font-sans opacity-70">
          Ready to Begin?
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Start the conversation</h2>
        <p className="opacity-45 mb-10 max-w-sm mx-auto leading-relaxed font-light">
          Reach out via WhatsApp and we&apos;ll guide you through the rest.
        </p>
        <Link
          href="/contact"
          className="inline-block px-10 py-4 bg-[var(--accent)] text-black text-[11px] tracking-[0.25em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
        >
          Request a Consultation
        </Link>
      </div>
    </main>
  );
}
