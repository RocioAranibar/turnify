const stats = [
  { label: "Turnos de hoy", value: "8" },
  { label: "Pendientes", value: "3" },
  { label: "Confirmados", value: "5" },
  { label: "Cancelados", value: "1" },
];

const nextAppointments = [
  { client: "Ana Gómez", date: "2026-07-01", time: "09:30", status: "Confirmado" },
  { client: "Juan Pérez", date: "2026-07-01", time: "11:00", status: "Pendiente" },
  { client: "Lucía Torres", date: "2026-07-02", time: "15:30", status: "Confirmado" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-blue-400">Turnify</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-zinc-400">
              Resumen general de turnos y actividad reciente.
            </p>
          </div>

          <a
            href="/appointments/new"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
          >
            Nuevo turno
          </a>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Próximos turnos</h2>
            <a href="/appointments" className="text-sm text-blue-400 hover:text-blue-300">
              Ver todos
            </a>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Hora</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {nextAppointments.map((appointment) => (
                  <tr key={`${appointment.client}-${appointment.time}`} className="border-t border-zinc-800">
                    <td className="px-4 py-3">{appointment.client}</td>
                    <td className="px-4 py-3 text-zinc-300">{appointment.date}</td>
                    <td className="px-4 py-3 text-zinc-300">{appointment.time}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}