import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import AppointmentsTable from "./AppointmentsTable";
export default async function AppointmentsPage() {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <p>Error al cargar turnos: {error.message}</p>
      </main>
    );
  }

  return (
   <AppLayout>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Turnos</h1>
            <p className="mt-2 text-zinc-400">
              Gestioná todos los turnos registrados.
            </p>
          </div>

          <Link
            href="/appointments/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            Nuevo turno
          </Link>
        </div>

        <AppointmentsTable appointments={appointments ?? []} /> 
  </AppLayout>
);
}