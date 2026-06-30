"use client";

import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const specialties = [
  "Clínica Médica",
  "Pediatría",
  "Traumatología",
  "Dermatología",
  "Cardiología",
  "Neurología",
];

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [doctor, setDoctor] = useState({
    full_name: "",
    email: "",
    license: "",
    specialty: "",
    active: true,
  });

  useEffect(() => {
    async function loadDoctor() {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMessage("No se encontró el médico.");
        return;
      }

      setDoctor(data);
    }

    loadDoctor();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("doctors")
      .update(doctor)
      .eq("id", id);

    if (error) {
      setMessage(`Error al actualizar: ${error.message}`);
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

        <h1 className="mt-6 text-3xl font-bold">Editar médico</h1>
        <p className="mt-2 text-zinc-400">
          Actualizá los datos del profesional.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <input
            value={doctor.full_name}
            onChange={(e) =>
              setDoctor({ ...doctor, full_name: e.target.value })
            }
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Nombre completo"
          />

          <input
            value={doctor.email ?? ""}
            onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
            type="email"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Email"
          />

          <input
            value={doctor.license}
            onChange={(e) =>
              setDoctor({ ...doctor, license: e.target.value })
            }
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Matrícula"
          />

          <select
            value={doctor.specialty}
            onChange={(e) =>
              setDoctor({ ...doctor, specialty: e.target.value })
            }
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Seleccioná una especialidad</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-3 text-zinc-300">
            <input
              type="checkbox"
              checked={doctor.active}
              onChange={(e) =>
                setDoctor({ ...doctor, active: e.target.checked })
              }
            />
            Médico activo
          </label>

          <div className="flex justify-end gap-3">
            <Link
              href="/doctors"
              className="rounded-xl bg-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Link>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

          {message && <p className="text-sm text-zinc-300">{message}</p>}
        </form>
      </div>
    </AppLayout>
  );
}