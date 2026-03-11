const topics = [
  {
    title: "Diet & Nutrition",
    content:
      "French Bulldogs do well on high-quality dry kibble formulated for small to medium breeds. Avoid overfeeding — Frenchies are prone to obesity, which puts extra strain on their joints and breathing. Feed twice a day and avoid exercise immediately after meals to reduce the risk of bloat.",
  },
  {
    title: "Exercise",
    content:
      "Frenchies need moderate daily exercise — two short walks a day is usually enough. Avoid strenuous activity in hot or humid weather as they are a brachycephalic (flat-faced) breed and can overheat quickly. Always carry water on walks.",
  },
  {
    title: "Breathing & Heat",
    content:
      "Because of their short snouts, French Bulldogs can struggle with breathing, especially in heat. Keep them in air-conditioned environments during summer, never leave them in a parked car, and watch for signs of distress like excessive panting or blue-tinged gums.",
  },
  {
    title: "Grooming",
    content:
      "Frenchies have short, low-maintenance coats that need a weekly brush. Pay special attention to their facial skin folds — clean them with a damp cloth regularly to prevent moisture buildup and infections. Nails should be trimmed every 3–4 weeks.",
  },
  {
    title: "Health Care",
    content:
      "Regular vet check-ups, vaccinations, and parasite prevention are essential. Common health issues in French Bulldogs include intervertebral disc disease (IVDD), allergies, and eye conditions. Pet insurance is strongly recommended.",
  },
  {
    title: "Temperament & Training",
    content:
      "Frenchies are intelligent but can be stubborn. Positive reinforcement works best — use treats and praise, and keep sessions short and fun. Early socialisation with people, children, and other animals is key to a well-adjusted adult dog.",
  },
];

export default function Education() {
  return (
    <main className="px-6 lg:px-16 py-24 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="text-center mb-20">
        <p className="text-[11px] tracking-[0.55em] uppercase text-[var(--accent)] mb-5 font-sans opacity-70">
          Knowledge
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-8">French Bulldog Care Guide</h1>
        <div className="flex items-center justify-center gap-5 mb-8">
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
        <p className="opacity-45 text-base font-light max-w-sm mx-auto">
          Everything you need to know about raising a happy, healthy Frenchie.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="bg-[var(--card)] border border-[var(--accent)]/10 p-8 group hover:border-[var(--accent)]/25 transition-all duration-300"
          >
            <div className="h-px w-8 bg-[var(--accent)]/50 mb-6 group-hover:w-14 transition-all duration-500" />
            <h2 className="text-xl font-serif font-light mb-4">{topic.title}</h2>
            <p className="opacity-50 leading-relaxed text-sm font-sans">{topic.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
