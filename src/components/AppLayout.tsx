import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-900 p-6 md:block">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-400">
            Turnify
          </Link>

          <nav className="mt-10 space-y-2">
            <Link href="/dashboard" className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Dashboard
            </Link>

            <Link href="/appointments" className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Turnos
            </Link>

            <Link href="/appointments/new" className="block rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Nuevo turno
            </Link>

            <Link href="/calendar" className="block rounded-xl px-4 py-3 text-zinc-500 hover:bg-zinc-800 hover:text-white">
              Calendario
            </Link>

            <Link href="/settings" className="block rounded-xl px-4 py-3 text-zinc-500 hover:bg-zinc-800 hover:text-white">
              Configuración
            </Link>
          </nav>
        </aside>

        <section className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </section>
      </div>
    </main>
  );
}