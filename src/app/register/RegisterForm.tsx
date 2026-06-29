"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;
  
    export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!emailRegex.test(email)) {
      setMessage("Ingresá un correo válido. Ej: usuario@gmail.com");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setMessage(`Error al crear cuenta: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
    >
      <h2 className="text-2xl font-semibold">Registrarse</h2>

      <div className="mt-6">
        <label className="text-sm text-zinc-300">Nombre completo</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Juan Pérez"
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-5">
        <label className="text-sm text-zinc-300">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          pattern="^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$"
          title="Ingresá un correo válido. Ej: usuario@gmail.com"
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

      <div className="mt-5">
        <label className="text-sm text-zinc-300">Confirmar contraseña</label>
        <input
          name="confirmPassword"
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
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
    </form>
  );
}