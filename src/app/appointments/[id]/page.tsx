import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import CancelAppointmentButton from "./CancelAppointmentButton";
import AppointmentActions from "./AppointmentActions";

type AppointmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusLabel(status: string) {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmado";
  if (status === "cancelled") return "Cancelado";
  if (status === "completed") return "Realizado";
  return status;
}

function getStatusClass(status: string) {
  if (status === "pending") return "bg-yellow-500/20 text-yellow-400";
  if (status === "confirmed") return "bg-green-500/20 text-green-400";
  if (status === "cancelled") return "bg-red-500/20 text-red-400";
  if (status === "completed") return "bg-sky-500/20 text-sky-400";
  return "bg-zinc-500/20 text-zinc-400";
}

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
      <AppLayout>
        <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
          ← Volver a la lista
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Turno no encontrado</h1>
        <p className="mt-2 text-zinc-400">
          No pudimos encontrar el turno solicitado.
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
        ← Volver a la lista
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_240px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg">
          <h1 className="text-2xl font-bold">Detalle del turno</h1>

          <div className="mt-8 space-y-5">
            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Cliente</p>
              <p className="font-medium">{appointment.client_name}</p>
            </div>

            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Email</p>
              <p className="font-medium">{appointment.client_email}</p>
            </div>

            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Fecha</p>
              <p className="font-medium">{appointment.appointment_date}</p>
            </div>

            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Hora</p>
              <p className="font-medium">
                {appointment.appointment_time.slice(0, 5)}
              </p>
            </div>

            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Estado</p>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  appointment.status
                )}`}
              >
                {getStatusLabel(appointment.status)}
              </span>
            </div>

            <div className="grid gap-2 md:grid-cols-[120px_1fr]">
              <p className="text-sm text-zinc-400">Notas</p>
              <p className="font-medium">
                {appointment.notes || "Sin notas"}
              </p>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          {appointment.status !== "completed" ? (
            <>
              <AppointmentActions
                appointmentId={appointment.id}
                status={appointment.status}
              />

              <Link
                href={`/appointments/${appointment.id}/edit`}
                className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
              >
                Editar turno
              </Link>

              <CancelAppointmentButton appointmentId={appointment.id} />
            </>
          ) : (
            <div className="rounded-xl border border-sky-800 bg-sky-500/10 px-4 py-3 text-sm text-sky-300">
              Este turno ya fue realizado.
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}