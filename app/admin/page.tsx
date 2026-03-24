"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const puppyCards = [
  {
    href: "/admin/new",
    icon: "➕",
    title: "Add New Puppy",
    sub: "Create a new listing",
  },
  {
    href: "/admin/puppies",
    icon: "🐾",
    title: "Manage Puppies",
    sub: "Edit status or remove listings",
  },
];

const siteCards = [
  {
    href: "/admin/site",
    icon: "🖼️",
    title: "Site Settings",
    sub: "Update hero image and site content",
  },
  {
    href: "/admin/pack",
    icon: "🐾",
    title: "Manage The Pack",
    sub: "Add, remove or update pack member photos",
  },
];

const shopCards = [
  {
    href: "/admin/products/new",
    icon: "➕",
    title: "Add New Product",
    sub: "Create a shop listing",
  },
  {
    href: "/admin/products",
    icon: "🛍️",
    title: "Manage Products",
    sub: "Edit status or remove products",
  },
  {
    href: "/admin/orders",
    icon: "📦",
    title: "Orders",
    sub: "View PayFast orders and revenue",
  },
];

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setSession(session);
      }
    }
    checkSession();
  }, []);

  if (!session) return null;

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-serif mb-1">Admin Dashboard</h1>
      <p className="opacity-40 text-sm mb-12">BrakEnKie management</p>

      <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Puppies</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {puppyCards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="p-6 bg-[var(--card)] rounded-2xl shadow hover:scale-[1.02] transition"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="font-serif text-lg">{card.title}</div>
            <div className="text-sm opacity-50 mt-1">{card.sub}</div>
          </a>
        ))}
      </div>

      <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Shop</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {shopCards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="p-6 bg-[var(--card)] rounded-2xl shadow hover:scale-[1.02] transition"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="font-serif text-lg">{card.title}</div>
            <div className="text-sm opacity-50 mt-1">{card.sub}</div>
          </a>
        ))}
      </div>
      <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Site</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {siteCards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="p-6 bg-[var(--card)] rounded-2xl shadow hover:scale-[1.02] transition"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="font-serif text-lg">{card.title}</div>
            <div className="text-sm opacity-50 mt-1">{card.sub}</div>
          </a>
        ))}
      </div>

    </div>
  );
}
