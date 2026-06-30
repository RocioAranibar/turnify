import AppLayout from "@/components/AppLayout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { CalendarDays, Check, CircleCheckBig, X } from "lucide-react";
import Link from "next/link";

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekDates() {
  const current = new Date();
  const day = current.getDay();
  const monday = new Date(current);

  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(current.getDate() + diff);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusLabel(status: string) {
  if (status === "confirmed") return "Confirmado";
  if (status === "completed") return "Realizado";
  if (status === "cancelled") return "Cancelado";
  return status;
}

function getStatusClass(status: string) {
  if (status === "confirmed") return "bg-green-500/20 text-green-400";
  if (status === "completed") return "bg-sky-500/20 text-sky-400";
  if (status === "cancelled") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

export default async function DashboardPage() {
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

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: true });

  if (error) {
    return (
      <AppLayout>
        <p>Error al cargar dashboard: {error.message}</p>
      </AppLayout>
    );
  }

  const today = getTodayLocal();
  const weekDates = getWeekDates();

  const todayAppointments =
    appointments
      ?.filter((appointment) => appointment.appointment_date === today)
      .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)) ??
    [];

  const weekAppointments =
    appointments?.filter((appointment) =>
      weekDates.includes(appointment.appointment_date)
    ) ?? [];

  const todayConfirmedAppointments = todayAppointments
    .filter((appointment) => appointment.status === "confirmed")
    .slice(0, 4);

  const nextConfirmedAppointments =
    appointments
      ?.filter(
        (appointment) =>
          appointment.status === "confirmed" &&
          appointment.appointment_date >= today
      )
      .sort((a, b) => {
        const dateA = `${a.appointment_date}T${a.appointment_time}`;
        const dateB = `${b.appointment_date}T${b.appointment_time}`;
        return dateA.localeCompare(dateB);
      })
      .slice(0, 3) ?? [];

  const todayTotal = todayAppointments.length;

  const todayConfirmed = todayAppointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const todayCompleted = todayAppointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const todayCancelled = todayAppointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  const weekConfirmed = weekAppointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const weekCompleted = weekAppointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const weekCancelled = weekAppointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  const appointmentsByDay = weekDates.map((date) => {
    return weekAppointments.filter(
      (appointment) => appointment.appointment_date === date
    ).length;
  });

  const maxAppointmentsByDay = Math.max(...appointmentsByDay, 1);

  const stats = [
    {
      label: "Turnos de hoy",
      value: todayTotal,
      description: "Agenda diaria",
      icon: CalendarDays,
      box: "bg-violet-600",
      text: "text-violet-400",
    },
    {
      label: "Confirmados",
      value: todayConfirmed,
      description: "Turnos confirmados",
      icon: Check,
      box: "bg-green-600",
      text: "text-green-400",
    },
    {
      label: "Realizados",
      value: todayCompleted,
      description: "Turnos realizados",
      icon: CircleCheckBig,
      box: "bg-sky-600",
      text: "text-sky-400",
    },
    {
      label: "Cancelados",
      value: todayCancelled,
      description: "Turnos cancelados",
      icon: X,
      box: "bg-red-600",
      text: "text-red-400",
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Resumen general de la agenda del consultorio.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300">
          <CalendarDays size={17} />
          <span className="capitalize">{formatTodayLabel()}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.box}`}
                >
                  <Icon size={28} />
                </div>

                <div>
                  <p className={`text-sm font-semibold ${item.text}`}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-4xl font-bold">{item.value}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Turnos de hoy</h2>

          <div className="mt-6 space-y-3">
            {todayConfirmedAppointments.length > 0 ? (
              todayConfirmedAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/${appointment.id}`}
                  className="grid gap-4 rounded-2xl bg-zinc-950/80 p-4 hover:bg-zinc-950 md:grid-cols-[70px_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-lg font-bold">
                      {appointment.appointment_time.slice(0, 5)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold">
                      {getInitials(appointment.client_name)}
                    </div>

                    <div>
                      <p className="font-semibold">{appointment.client_name}</p>
                      <p className="text-sm text-zinc-400">
                        {appointment.notes || "Consulta general"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">
                      {appointment.doctor || "Sin médico"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {appointment.specialty || "Sin especialidad"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl bg-zinc-950/80 p-5 text-zinc-400">
                No hay turnos confirmados para hoy.
              </p>
            )}
          </div>

          <Link
            href="/appointments"
            className="mt-6 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            Ver más turnos →
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Próximos turnos</h2>

          <div className="mt-6 divide-y divide-zinc-800">
            {nextConfirmedAppointments.length > 0 ? (
              nextConfirmedAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments/${appointment.id}`}
                  className="block py-4 first:pt-0 last:pb-0 hover:text-blue-400"
                >
                  <p className="text-lg font-bold">
                    {appointment.appointment_time.slice(0, 5)}
                  </p>
                  <p className="mt-1 font-semibold">
                    {appointment.client_name}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {appointment.specialty || "Sin especialidad"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-zinc-400">
                No hay próximos turnos confirmados.
              </p>
            )}
          </div>

          <Link
            href="/calendar"
            className="mt-6 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            Ver agenda completa →
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Turnos por día esta semana</h2>

          <div className="mt-8 flex h-44 items-end gap-3">
            {appointmentsByDay.map((count, index) => {
              const height = (count / maxAppointmentsByDay) * 100;

              return (
                <div
                  key={weekDates[index]}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex h-32 w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-violet-600/80"
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span className="text-xs text-zinc-500">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][index]}
                  </span>

                  <span className="text-xs text-zinc-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">
            Turnos por estado esta semana
          </h2>

          <div className="mt-8 grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-green-400">● Confirmados</span>
              <span>{weekConfirmed}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sky-400">● Realizados</span>
              <span>{weekCompleted}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-red-400">● Cancelados</span>
              <span>{weekCancelled}</span>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}