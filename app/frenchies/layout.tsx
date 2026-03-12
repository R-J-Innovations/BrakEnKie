import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet the Frenchies",
  description:
    "Meet the BrakEnKie pack — our French Bulldogs and the parent dogs behind every litter. Raised on a 5-hectare farm in the Cradle of Humankind, South Africa.",
  keywords: [
    "BrakEnKie pack",
    "French Bulldog parent dogs South Africa",
    "French Bulldog stud South Africa",
    "French Bulldog breeding pair South Africa",
    "Frenchie parents Gauteng",
    "French Bulldog bloodlines South Africa",
  ],
  openGraph: {
    title: "Meet the Frenchies | BrakEnKie",
    description:
      "Meet the parent dogs of every BrakEnKie litter — family-raised French Bulldogs on a farm in the Cradle of Humankind.",
  },
  alternates: { canonical: "/frenchies" },
};

export default function FrenciesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
