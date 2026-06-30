"use client";

import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const supabase = createBrowserSupabaseClient();

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error al iniciar sesión: ${error.message}`);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
    >
      <h2 className="text-2xl font-semibold">Iniciar sesión</h2>

      <div className="mt-6">
        <label className="text-sm text-zinc-300">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-5">
        <label className="text-sm text-zinc-300">Contraseña</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}

      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿No tenés una cuenta?{" "}
        <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
          Registrate
        </Link>
      </p>
    </form>
  );
}