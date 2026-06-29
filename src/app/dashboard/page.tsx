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
  const pending =
    appointments?.filter((a) => a.status === "pending").length ?? 0;
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
    {
      label: "Total turnos",
      value: total,
      description: "Todos los turnos",
      color: "text-blue-400",
    },
    {
      label: "Pendientes",
      value: pending,
      description: "Turnos pendientes",
      color: "text-orange-400",
    },
    {
      label: "Confirmados",
      value: confirmed,
      description: "Turnos confirmados",
      color: "text-green-400",
    },
    {
      label: "Cancelados",
      value: cancelled,
      description: "Turnos cancelados",
      color: "text-red-400",
    },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Resumen general de tu agenda.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg"
          >
            <p className={`text-sm font-semibold ${item.color}`}>
              {item.label}
            </p>

            <p className="mt-3 text-4xl font-bold">{item.value}</p>

            <p className="mt-2 text-sm text-zinc-400">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold">Próximo turno</h2>

        {nextAppointment ? (
          <div className="mt-6 flex flex-col justify-between gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl shadow-lg shadow-blue-600/20">
                👤
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {nextAppointment.client_name}
                </p>

                <p className="mt-1 text-zinc-400">
                  {nextAppointment.appointment_date} -{" "}
                  {nextAppointment.appointment_time.slice(0, 5)}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {nextAppointment.notes || "Sin notas"}
                </p>
              </div>
            </div>

            <Link
              href={`/appointments/${nextAppointment.id}`}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
            >
              Ver detalles
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
            No hay turnos confirmados.
          </div>
        )}
      </section>
    </AppLayout>
  );
}