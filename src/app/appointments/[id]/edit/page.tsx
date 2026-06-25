import { supabase } from "@/lib/supabase";
import Link from "next/link";
import EditAppointmentForm from "./EditAppointmentForm";

type EditAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAppointmentPage({
  params,
}: EditAppointmentPageProps) {
  const { id } = await params;

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !appointment) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-3xl">
          <Link href="/appointments" className="text-blue-400">
            ← Volver
          </Link>
          <h1 className="mt-6 text-3xl font-bold">Turno no encontrado</h1>
        </div>
      </main>
    );
  }

  return <EditAppointmentForm appointment={appointment} />;
}