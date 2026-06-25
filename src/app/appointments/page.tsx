import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function AppointmentsPage() {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <p>Error al cargar turnos: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Turnos</h1>
            <p className="mt-2 text-zinc-400">
              Gestioná todos los turnos registrados.
            </p>
          </div>

          <a
            href="/appointments/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Nuevo turno
          </a>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-left">
            <thead className="bg-zinc-900">
             <tr>
                <th className="px-4 py-4">Cliente</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Fecha</th>
                <th className="px-4 py-4">Hora</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4">Acciones</th>
            </tr>
            </thead>

            <tbody>
              {appointments?.map((appointment) => (
                <tr key={appointment.id} className="border-t border-zinc-800">
                    <td className="px-4 py-4">{appointment.client_name}</td>
                    <td className="px-4 py-4">{appointment.client_email}</td>
                    <td className="px-4 py-4">{appointment.appointment_date}</td>
                    <td className="px-4 py-4">{appointment.appointment_time}</td>
                    <td className="px-4 py-4">{appointment.status}</td>

                    <td className="px-4 py-4">
                        <Link
                        href={`/appointments/${appointment.id}`}
                        className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                        >
                        Ver
                        </Link>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}