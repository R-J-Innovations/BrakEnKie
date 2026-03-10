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
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif mb-4 text-center">French Bulldog Care Guide</h1>
      <p className="text-center opacity-70 mb-12">
        Everything you need to know about raising a happy, healthy Frenchie
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {topics.map((topic) => (
          <div key={topic.title} className="bg-[var(--card)] rounded-2xl p-6 shadow">
            <h2 className="text-xl font-serif mb-3">{topic.title}</h2>
            <p className="opacity-80 leading-relaxed text-sm">{topic.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
