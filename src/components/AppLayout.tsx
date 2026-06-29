import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-6 md:flex">          <Link href="/dashboard" className="text-2xl font-bold text-blue-400">
            Turnify
          </Link>

          <nav className="mt-10 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/appointments"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <CalendarCheck size={18} />
              Turnos
            </Link>

            <Link
              href="/appointments/new"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <CalendarPlus size={18} />
              Nuevo turno
            </Link>

            <Link
              href="/calendar"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <CalendarDays size={18} />
              Calendario
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Settings size={18} />
              Configuración
            </Link>
          </nav>
          <div className="mt-auto pt-10">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <section className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </section>
      </div>
    </main>
  );
}