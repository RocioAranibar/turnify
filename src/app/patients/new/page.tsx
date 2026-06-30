"use client";

import AppLayout from "@/components/AppLayout";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

export default function NewPatientPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const full_name = String(formData.get("full_name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const dni = String(formData.get("dni") ?? "").trim();

    if (!emailRegex.test(email)) {
      setMessage("Ingresá un correo válido.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("No hay usuario autenticado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("patients").insert({
      full_name,
      email,
      phone,
      dni,
      user_id: user.id,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/patients");
    router.refresh();
  }

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <Link href="/patients" className="text-blue-400 hover:text-blue-300">
          ← Volver
        </Link>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg">
          <h1 className="text-3xl font-bold">Nuevo paciente</h1>

          <p className="mt-2 text-zinc-400">
            Registrá un nuevo paciente del consultorio.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            <div>
              <label className="text-sm text-zinc-300">Nombre completo</label>

              <input
                name="full_name"
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">DNI</label>

              <input
                name="dni"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Email</label>

              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Teléfono</label>

              <input
                name="phone"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex justify-end gap-3 md:col-span-2">
              <Link
                href="/patients"
                className="rounded-xl bg-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-600"
              >
                Cancelar
              </Link>

              <button
                disabled={loading}
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar paciente"}
              </button>
            </div>

            {message && (
              <p className="text-sm text-red-400 md:col-span-2">{message}</p>
            )}
          </form>
        </section>
      </div>
    </AppLayout>
  );
}