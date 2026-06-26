import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <section className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-400">
              Turnify
            </Link>

            <h1 className="mt-10 text-4xl font-bold">
              Bienvenido de nuevo
            </h1>

            <p className="mt-4 max-w-md text-zinc-400">
              Iniciá sesión para continuar gestionando tus turnos.
            </p>
          </div>

          <form className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Iniciar sesión</h2>

            <div className="mt-6">
              <label className="text-sm text-zinc-300">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm text-zinc-300">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input type="checkbox" />
                Recordarme
              </label>

              <a href="#" className="text-blue-400 hover:text-blue-300">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Link
              href="/dashboard"
              className="mt-6 block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold hover:bg-blue-500"
            >
              Iniciar sesión
            </Link>

            <p className="mt-6 text-center text-sm text-zinc-400">
              ¿No tenés cuenta?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Registrate
              </a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}