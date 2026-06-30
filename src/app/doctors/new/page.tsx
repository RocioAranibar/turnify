"use client";

import AppLayout from "@/components/AppLayout";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const specialties = [
  "Clínica Médica",
  "Pediatría",
  "Traumatología",
  "Dermatología",
  "Cardiología",
  "Neurología",
];

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

export default function NewDoctorPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (email && !emailRegex.test(email)) {
      setMessage(
        "Ingresá un correo válido. Ej: medico@gmail.com o medico@consultorio.com.ar"
      );
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

    const newDoctor = {
      full_name: String(formData.get("full_name") ?? ""),
      email,
      license: String(formData.get("license") ?? ""),
      specialty: String(formData.get("specialty") ?? ""),
      active: true,
      user_id: user.id,
    };

    const { error } = await supabase.from("doctors").insert(newDoctor);

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push("/doctors");
    router.refresh();
  }

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <Link href="/doctors" className="text-blue-400 hover:text-blue-300">
          ← Volver a médicos
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Nuevo médico</h1>
        <p className="mt-2 text-zinc-400">
          Cargá los datos del profesional del consultorio.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div>
            <label className="block text-sm text-zinc-300">
              Nombre completo
            </label>
            <input
              name="full_name"
              type="text"
              required
              placeholder="Dr. García"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              name="email"
              type="email"
              placeholder="garcia@consultorio.com"
              pattern="^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$"
              title="Ingresá un correo válido. Ej: medico@gmail.com o medico@consultorio.com.ar"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Matrícula</label>
            <input
              name="license"
              type="text"
              required
              placeholder="M.P. 123456"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Especialidad</label>
            <select
              name="specialty"
              required
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Seleccioná una especialidad</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/doctors"
              className="rounded-xl bg-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar médico"}
            </button>
          </div>

          {message && <p className="text-sm text-zinc-300">{message}</p>}
        </form>
      </div>
    </AppLayout>
  );
}