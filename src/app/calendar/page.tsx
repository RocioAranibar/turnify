import AppLayout from "@/components/AppLayout";
import CalendarView from "@/components/calendar/CalendarView";
import { supabase } from "@/lib/supabase";

export default async function CalendarPage() {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    return (
      <AppLayout>
        <p>Error al cargar calendario: {error.message}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Calendario</h1>
        <p className="mt-2 text-zinc-400">
          Visualizá tus turnos confirmados y pendientes.
        </p>
      </div>

      <div className="mt-8">
        <CalendarView appointments={appointments ?? []} />
      </div>
    </AppLayout>
  );
}