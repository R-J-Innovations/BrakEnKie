"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-(--card-light) dark:bg-(--card-dark) p-10 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
        {errorMsg && (
          <div className="mb-4 text-red-600 text-center">{errorMsg}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg border"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg border"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-3 bg-(--accent) rounded-lg font-medium text-black">
          Login
        </button>
      </form>
    </div>
  );
}
