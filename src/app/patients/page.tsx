import AppLayout from "@/components/AppLayout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Pencil, Plus, Search, User } from "lucide-react";
import Link from "next/link";

export default async function PatientsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppLayout>
        <p>No hay usuario autenticado.</p>
      </AppLayout>
    );
  }

  const { data: patients, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", user.id)
    .order("full_name");

  if (error) {
    return (
      <AppLayout>
        <p>Error al cargar pacientes: {error.message}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="mt-2 text-zinc-400">
            Gestioná los pacientes del consultorio.
          </p>
        </div>

        <Link
          href="/patients/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
        >
          <Plus size={18} />
          Nuevo paciente
        </Link>
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3">
          <Search size={18} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full bg-transparent outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-950 text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-4 py-4">Paciente</th>
                <th className="px-4 py-4">DNI</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Teléfono</th>
                <th className="px-4 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(patients ?? []).map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-zinc-800 hover:bg-zinc-950/60"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700">
                        <User size={18} />
                      </div>
                      <p className="font-semibold">{patient.full_name}</p>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {patient.dni || "Sin DNI"}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">{patient.email}</td>

                  <td className="px-4 py-4 text-zinc-400">
                    {patient.phone || "Sin teléfono"}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <Link
                        href={`/patients/${patient.id}/edit`}
                        className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition hover:border-violet-500 hover:bg-violet-500/10 hover:text-violet-400"
                        title="Editar paciente"
                      >
                        <Pencil size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {(patients ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-zinc-400"
                  >
                    No hay pacientes cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-zinc-500">
          Mostrando {(patients ?? []).length} pacientes
        </p>
      </section>
    </AppLayout>
  );
}