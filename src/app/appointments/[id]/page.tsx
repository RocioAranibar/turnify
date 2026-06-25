import { supabase } from "@/lib/supabase";
import Link from "next/link";

type AppointmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const { id } = await params;

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !appointment) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
            ← Volver a turnos
          </Link>

          <h1 className="mt-6 text-3xl font-bold">Turno no encontrado</h1>
          <p className="mt-2 text-zinc-400">
            No pudimos encontrar el turno solicitado.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
          ← Volver a turnos
        </Link>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Detalle del turno</h1>
                <p className="mt-2 text-zinc-400">
                Información completa del turno seleccionado.
                </p>
            </div>

            <Link
                href={`/appointments/${appointment.id}/edit`}
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
            >
                Editar
            </Link>
            </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm text-zinc-500">Cliente</p>
              <p className="text-lg">{appointment.client_name}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Email</p>
              <p className="text-lg">{appointment.client_email}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Fecha</p>
                <p className="text-lg">{appointment.appointment_date}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Hora</p>
                <p className="text-lg">{appointment.appointment_time}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Estado</p>
              <p className="text-lg">{appointment.status}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Notas</p>
              <p className="text-lg">{appointment.notes || "Sin notas"}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}