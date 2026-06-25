export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Ingresar a Turnify</h1>
        <p className="mt-2 text-zinc-400">
          Accedé al panel para gestionar tus turnos.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
          >
            Ingresar
          </button>
        </form>
      </section>
    </main>
  );
}