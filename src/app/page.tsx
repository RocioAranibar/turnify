import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          Turnify
        </Link>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a href="#features" className="hover:text-white">
            Características
          </a>
          <a href="#how-it-works" className="hover:text-white">
            ¿Cómo funciona?
          </a>
          <Link href="/login" className="hover:text-white">
            Ingresar
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Sistema interno de gestión de turnos
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
            Gestioná tus turnos de manera simple
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            Turnify ayuda a recepcionistas, administradores y negocios a crear,
            confirmar, editar y organizar turnos desde un panel moderno y fácil
            de usar.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold hover:bg-blue-500"
            >
              Comenzar ahora
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-center font-semibold text-zinc-300 hover:bg-zinc-900"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Hoy</p>
                  <h2 className="text-2xl font-bold">Agenda</h2>
                </div>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                  Activa
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-semibold">Ana Gómez</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    09:30 · Confirmado
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-semibold">Juan Pérez</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    11:00 · Pendiente
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-semibold">Lucía Torres</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    15:30 · Confirmado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3"
      >
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-semibold">Gestión centralizada</h3>
          <p className="mt-3 text-zinc-400">
            Visualizá todos los turnos desde un único panel.
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-semibold">Estados claros</h3>
          <p className="mt-3 text-zinc-400">
            Pendiente, confirmado, cancelado y realizado.
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="text-xl font-semibold">Dashboard real</h3>
          <p className="mt-3 text-zinc-400">
            Métricas y próximos turnos conectados a Supabase.
          </p>
        </article>
      </section>
    </main>
  );
}