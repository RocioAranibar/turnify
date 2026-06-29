import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

  const today = getTodayLocal();

  const total = appointments?.length ?? 0;
  const pending =
    appointments?.filter((a) => a.status === "pending").length ?? 0;
  const confirmed =
    appointments?.filter((a) => a.status === "confirmed").length ?? 0;
  const cancelled =
    appointments?.filter((a) => a.status === "cancelled").length ?? 0;

  const todayAppointments =
    appointments
      ?.filter(
        (appointment) =>
          appointment.appointment_date === today &&
          (appointment.status === "confirmed" ||
            appointment.status === "pending")
      )
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)) ??
    [];

  const todayConfirmed = todayAppointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const todayPending = todayAppointments.filter(
    (appointment) => appointment.status === "pending"
  );

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
        <p className="mt-2 text-zinc-400">Resumen general de tu agenda.</p>
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

            <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-green-400">
            Confirmados de hoy
          </h2>

          <div className="mt-6 space-y-4">
            {todayConfirmed.length > 0 ? (
              todayConfirmed.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/${appointment.id}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:bg-zinc-900"
                >
                  <p className="font-semibold">{appointment.client_name}</p>
                  <p className="mt-1 text-zinc-400">
                    {appointment.appointment_time.slice(0, 5)} hs
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-zinc-400">No hay turnos confirmados hoy.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-yellow-400">
            Pendientes de hoy
          </h2>

          <div className="mt-6 space-y-4">
            {todayPending.length > 0 ? (
              todayPending.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/${appointment.id}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:bg-zinc-900"
                >
                  <p className="font-semibold">{appointment.client_name}</p>
                  <p className="mt-1 text-zinc-400">
                    {appointment.appointment_time.slice(0, 5)} hs
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-zinc-400">No hay turnos pendientes hoy.</p>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}