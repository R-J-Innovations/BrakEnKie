export type Puppy = {
  id: string;
  name: string;
  gender: string;
  color: string;
  dob?: string;
  description: string;
  status: string;
  puppy_images: { image_url: string }[];
};

function formatAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  const weeks = Math.floor((now.getTime() - birth.getTime()) / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} old`;
  const months = Math.floor(weeks / 4.33);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} old`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} old`;
}

export default function PuppyCard({ puppy }: { puppy: Puppy }) {
  const imageUrl =
    puppy.puppy_images?.[0]?.image_url || "https://placehold.co/600x600";

  return (
    <div className="group bg-[var(--card)] overflow-hidden border border-[var(--accent)]/12 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(184,147,90,0.12)] hover:-translate-y-1.5">

      <a href={`/available/${puppy.id}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={puppy.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        {/* Gold overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </a>

      <div className="p-6 border-t border-[var(--accent)]/10">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-serif font-light">{puppy.name}</h3>
          <span
            className={`text-[10px] tracking-[0.18em] uppercase px-3 py-1 font-sans flex-shrink-0 ${
              puppy.status === "available"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : puppy.status === "reserved"
                ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                : "bg-black/5 dark:bg-white/5 opacity-50"
            }`}
          >
            {puppy.status}
          </span>
        </div>

        <p className="text-[11px] tracking-[0.22em] uppercase opacity-40 mb-4 font-sans">
          {puppy.gender} &bull; {puppy.color}
          {puppy.dob && ` \u2022 ${formatAge(puppy.dob)}`}
        </p>

        <p className="text-sm opacity-55 mb-6 leading-relaxed">{puppy.description}</p>

        <a
          href={`https://wa.me/27XXXXXXXXX?text=Hi%20I%20am%20interested%20in%20${puppy.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center px-6 py-3 bg-[var(--accent)] text-black text-[11px] tracking-[0.22em] uppercase font-sans hover:bg-[var(--accent-hover)] transition-all duration-300"
        >
          Enquire for Price
        </a>
      </div>
    </div>
  );
}
