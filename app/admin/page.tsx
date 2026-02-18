"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
      <h1 className="text-3xl font-serif mb-10">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <a
          href="/admin/new"
          className="p-6 bg-[var(--card-light)] dark:bg-[var(--card-dark)] rounded-2xl shadow hover:scale-[1.02] transition"
        >
          Add New Puppy
        </a>
      </div>
    </div>
  );
}
