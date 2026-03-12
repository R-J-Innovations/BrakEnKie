import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Available French Bulldog Puppies",
  description:
    "Browse available French Bulldog puppies from BrakEnKie in South Africa. Family-raised Frenchies looking for their forever homes in Gauteng and beyond.",
  keywords: [
    "French Bulldog puppies for sale South Africa",
    "available French Bulldog puppies",
    "Frenchie puppies for sale Gauteng",
    "French Bulldog puppies Johannesburg",
    "buy French Bulldog puppy South Africa",
    "French Bulldog litter South Africa",
    "Frenchie for sale near me",
  ],
  openGraph: {
    title: "Available Puppies | BrakEnKie French Bulldogs",
    description:
      "Family-raised French Bulldog puppies available from BrakEnKie on a 5-hectare farm in South Africa.",
  },
  alternates: { canonical: "/available" },
};

export default function AvailableLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
