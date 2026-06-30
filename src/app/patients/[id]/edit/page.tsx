"use client";

import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [patient, setPatient] = useState({
    full_name: "",
    email: "",
    phone: "",
    dni: "",
  });

  useEffect(() => {
    async function loadPatient() {
      const { data, error } = await supabase
        .from("patients")
        .select("full_name, email, phone, dni")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMessage("No se encontró el paciente.");
        return;
      }

      setPatient({
        full_name: data.full_name ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        dni: data.dni ?? "",
      });
    }

    loadPatient();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!emailRegex.test(patient.email)) {
      setMessage("Ingresá un correo válido.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("patients")
      .update(patient)
      .eq("id", id);

    if (error) {
      setMessage(`Error al actualizar: ${error.message}`);
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
          ← Volver a pacientes
        </Link>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg">
          <h1 className="text-3xl font-bold">Editar paciente</h1>
          <p className="mt-2 text-zinc-400">
            Modificá los datos del paciente.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-300">Nombre completo</label>
              <input
                value={patient.full_name}
                onChange={(e) =>
                  setPatient({ ...patient, full_name: e.target.value })
                }
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">DNI</label>
              <input
                value={patient.dni}
                onChange={(e) =>
                  setPatient({ ...patient, dni: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Email</label>
              <input
                type="email"
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Teléfono</label>
              <input
                value={patient.phone}
                onChange={(e) =>
                  setPatient({ ...patient, phone: e.target.value })
                }
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
                {loading ? "Guardando..." : "Guardar cambios"}
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