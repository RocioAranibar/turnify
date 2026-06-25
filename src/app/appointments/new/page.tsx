export default function NewAppointmentPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Nuevo turno</h1>
          <p className="mt-2 text-zinc-400">
            Registrá un nuevo turno para un cliente.
          </p>
        </div>

        <form className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <label className="block text-sm text-zinc-300">
              Nombre del cliente
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="juan@email.com"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-300">Fecha</label>
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300">Hora</label>
              <input
                type="time"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Estado</label>
            <select className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500">
              <option>Pendiente</option>
              <option>Confirmado</option>
              <option>Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Notas</label>
            <textarea
              rows={4}
              placeholder="Información adicional..."
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Guardar turno
          </button>
        </form>
      </div>
    </main>
  );
}