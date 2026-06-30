import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
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
  if (status === "pending") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  if (status === "confirmed") return "bg-green-500/20 text-green-400 border-green-500/30";
  if (status === "cancelled") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (status === "completed") return "bg-sky-500/20 text-sky-400 border-sky-500/30";
  return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
        <h1 className="text-3xl font-bold">Turno no encontrado</h1>
      </AppLayout>
    );
  }

  const { data: patientAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_email", appointment.client_email);

  const totalAppointments = patientAppointments?.length ?? 0;
  const completedAppointments =
    patientAppointments?.filter((a) => a.status === "completed").length ?? 0;
  const cancelledAppointments =
    patientAppointments?.filter((a) => a.status === "cancelled").length ?? 0;

  const lastAppointment = patientAppointments
    ?.filter((a) => a.id !== appointment.id)
    .sort((a, b) =>
      `${b.appointment_date} ${b.appointment_time}`.localeCompare(
        `${a.appointment_date} ${a.appointment_time}`
      )
    )[0];

  return (
    <AppLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Detalle del turno</h1>
          <p className="mt-2 text-zinc-400">
            Dashboard &gt; Turnos &gt; Detalle
          </p>
        </div>

        <span
          className={`rounded-xl border px-5 py-2 text-sm font-semibold ${getStatusClass(
            appointment.status
          )}`}
        >
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-lg">
          <h2 className="text-xl font-semibold">Información del turno</h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm text-zinc-400">Paciente</p>
              <p className="mt-2 font-medium">{appointment.client_name}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Email</p>
              <p className="mt-2 font-medium">{appointment.client_email}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Especialidad</p>
              <p className="mt-2 font-medium">
                {appointment.specialty || "Sin especialidad"}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Médico</p>
              <p className="mt-2 font-medium">
                {appointment.doctor || "Sin médico"}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Fecha</p>
              <p className="mt-2 font-medium">
                {formatDate(appointment.appointment_date)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Hora</p>
              <p className="mt-2 font-medium">
                {appointment.appointment_time.slice(0, 5)}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Duración</p>
              <p className="mt-2 font-medium">30 minutos</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Consultorio</p>
              <p className="mt-2 font-medium">
                {appointment.office || "Sin consultorio"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-zinc-400">Motivo de consulta</p>
              <p className="mt-2 font-medium">
                {appointment.notes || "Consulta general"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-zinc-400">Notas</p>
              <p className="mt-2 font-medium">
                {appointment.notes || "Sin notas"}
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-6">

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
            <h2 className="mb-5 text-xl font-semibold">Acciones</h2>

            <div className="space-y-3">

              {appointment.status === "confirmed" && (
                <>
                  <Link
                    href={`/appointments/${appointment.id}/edit`}
                    className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
                  >
                    ✏️ Editar turno
                  </Link>

                  <AppointmentActions
                    appointmentId={appointment.id}
                    status={appointment.status}
                  />
                </>
              )}

              {appointment.status === "cancelled" && (
                <div className="rounded-xl border border-red-800 bg-red-500/10 p-4 text-center text-red-300">
                  Este turno fue cancelado.
                </div>
              )}

              {appointment.status === "completed" && (
                <div className="rounded-xl border border-sky-800 bg-sky-500/10 p-4 text-center text-sky-300">
                  Este turno ya fue realizado.
                </div>
              )}

            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
            <h2 className="mb-5 text-xl font-semibold">
              Historial del paciente
            </h2>
            <div className="mt-6 space-y-4 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span>Total de turnos:</span>
                <span className="font-semibold">{totalAppointments}</span>
              </div>

              <div className="flex justify-between">
                <span>Turnos realizados:</span>
                <span className="font-semibold">{completedAppointments}</span>
              </div>

              <div className="flex justify-between">
                <span>Cancelados:</span>
                <span className="font-semibold">{cancelledAppointments}</span>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-zinc-400">Último turno:</p>
                <p className="mt-2 font-semibold">
                  {lastAppointment
                    ? formatDate(lastAppointment.appointment_date)
                    : "Sin historial previo"}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}