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
    <div className="bg-[var(--card)] rounded-2xl shadow-md overflow-hidden transition hover:scale-[1.02]">
      <a href={`/available/${puppy.id}`}>
        <div className="aspect-square overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={puppy.name}
            className="w-full h-full object-cover"
          />
        </div>
      </a>
      <div className="p-6">
        <h3 className="text-2xl font-serif mb-2">{puppy.name}</h3>
        <p className="text-sm opacity-70 mb-2">
          {puppy.gender} • {puppy.color}
          {puppy.dob && ` • ${formatAge(puppy.dob)}`}
        </p>
        <p className="text-sm mb-4">{puppy.description}</p>
        <span
          className={`inline-block px-3 py-1 text-xs rounded-full mb-4 ${
            puppy.status === "available"
              ? "bg-green-500 text-white"
              : puppy.status === "reserved"
              ? "bg-yellow-500 text-black"
              : "bg-gray-400 text-black"
          }`}
        >
          {puppy.status}
        </span>
        <a
          href={`https://wa.me/27XXXXXXXXX?text=Hi%20I%20am%20interested%20in%20${puppy.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center px-6 py-3 bg-yellow-500 rounded-lg font-medium text-black"
        >
          Enquire for Price
        </a>
      </div>
    </div>
  );
}
