const appointments = [
  {
    id: 1,
    client: "Ana Gómez",
    date: "2026-07-01",
    time: "09:30",
    status: "Confirmado",
  },
  {
    id: 2,
    client: "Juan Pérez",
    date: "2026-07-01",
    time: "11:00",
    status: "Pendiente",
  },
  {
    id: 3,
    client: "Lucía Torres",
    date: "2026-07-02",
    time: "15:30",
    status: "Cancelado",
  },
];

export default function AppointmentsPage() {
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
                <th className="px-4 py-4">Fecha</th>
                <th className="px-4 py-4">Hora</th>
                <th className="px-4 py-4">Estado</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-t border-zinc-800"
                >
                  <td className="px-4 py-4">{appointment.client}</td>
                  <td className="px-4 py-4">{appointment.date}</td>
                  <td className="px-4 py-4">{appointment.time}</td>
                  <td className="px-4 py-4">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}