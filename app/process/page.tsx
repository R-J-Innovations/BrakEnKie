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
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-5xl font-serif mb-4 text-center">Private Reservation</h1>
      <p className="text-center opacity-60 mb-16 text-lg max-w-xl mx-auto leading-relaxed">
        We keep reservations personal and intentional. Every puppy goes to a home we trust.
      </p>

      <div className="space-y-6 mb-16">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-8 items-start p-8 bg-[var(--card)] rounded-2xl shadow"
          >
            <span className="text-5xl font-serif opacity-20 flex-shrink-0 leading-none">
              {step.number}
            </span>
            <div>
              <h3 className="text-xl font-serif mb-3">{step.title}</h3>
              <p className="opacity-60 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-[var(--card)] rounded-3xl p-12">
        <h2 className="text-3xl font-serif mb-4">Ready to begin?</h2>
        <p className="opacity-60 mb-8 max-w-md mx-auto leading-relaxed">
          Reach out via WhatsApp and we&apos;ll guide you through the rest.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-[var(--accent)] rounded-xl font-medium text-black hover:opacity-90 transition-opacity"
        >
          Request a Consultation
        </Link>
      </div>
    </main>
  );
}
