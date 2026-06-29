import AppLayout from "@/components/AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="mt-2 text-zinc-400">
          Gestioná las preferencias del sistema.
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Perfil</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-300">Nombre</label>
            <input
              type="text"
              defaultValue="Rocio"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              type="email"
              defaultValue="rocio@email.com"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Guardar cambios
          </button>
        </div>

        <div className="my-8 border-t border-zinc-800" />

        <h2 className="text-xl font-semibold">Cambiar contraseña</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-sm text-zinc-300">Contraseña actual</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Nueva contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Actualizar contraseña
          </button>
        </div>
      </section>
    </AppLayout>
  );
}