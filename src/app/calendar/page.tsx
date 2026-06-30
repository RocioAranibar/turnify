import AppLayout from "@/components/AppLayout";
import CalendarView from "@/components/calendar/CalendarView";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default async function CalendarPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppLayout>
        <p>No hay usuario autenticado.</p>
      </AppLayout>
    );
  }

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
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
          Visualizá tus turnos confirmados, realizados y cancelados.
        </p>
      </div>

      <div className="mt-8">
        <CalendarView appointments={appointments ?? []} />
      </div>
    </AppLayout>
  );
}