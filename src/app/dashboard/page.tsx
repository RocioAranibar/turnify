import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
export default async function DashboardPage() {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <p>Error al cargar dashboard: {error.message}</p>
      </main>
    );
  }

  const total = appointments?.length ?? 0;
  const pending = appointments?.filter((a) => a.status === "pending").length ?? 0;
  const confirmed =
    appointments?.filter((a) => a.status === "confirmed").length ?? 0;
  const cancelled =
    appointments?.filter((a) => a.status === "cancelled").length ?? 0;

  const nextAppointment = appointments
    ?.filter((appointment) => appointment.status === "confirmed")
    .sort((a, b) => {
      const dateA = new Date(
        `${a.appointment_date}T${a.appointment_time}`
      ).getTime();

      const dateB = new Date(
        `${b.appointment_date}T${b.appointment_time}`
      ).getTime();

      return dateA - dateB;
    })[0];

  const stats = [
    { label: "Total de turnos", value: total },
    { label: "Pendientes", value: pending },
    { label: "Confirmados", value: confirmed },
    { label: "Cancelados", value: cancelled },
  ];

return (
  <AppLayout>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm text-blue-400">Turnify</p>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Resumen real de los turnos registrados.
        </p>
      </div>

      <Link
        href="/appointments/new"
        className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
      >
        Nuevo turno
      </Link>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <p className="text-sm text-zinc-400">{item.label}</p>
          <p className="mt-3 text-4xl font-bold">{item.value}</p>
        </article>
      ))}
    </div>

    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold">Próximo turno</h2>

      {nextAppointment ? (
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-semibold">
              {nextAppointment.client_name}
            </p>

            <p className="mt-1 text-zinc-400">
              {nextAppointment.appointment_date} -{" "}
              {nextAppointment.appointment_time}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {nextAppointment.notes || "Sin notas"}
            </p>
          </div>

          <Link
            href={`/appointments/${nextAppointment.id}`}
            className="rounded-xl bg-blue-600 px-4 py-2 text-center font-semibold hover:bg-blue-500"
          >
            Ver detalle
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-zinc-400">
          No hay turnos confirmados.
        </p>
      )}
    </section>
  </AppLayout>
);
}