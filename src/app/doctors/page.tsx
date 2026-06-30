import AppLayout from "@/components/AppLayout";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Plus } from "lucide-react";
import Link from "next/link";
import DoctorsTable from "./DoctorsTable";

export default async function DoctorsPage() {
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

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("user_id", user.id)
    .order("full_name");

  if (error) {
    return (
      <AppLayout>
        <p>Error: {error.message}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Médicos</h1>
          <p className="mt-2 text-zinc-400">
            Gestioná los médicos del consultorio.
          </p>
        </div>

        <Link
          href="/doctors/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
        >
          <Plus size={18} />
          Nuevo médico
        </Link>
      </div>

      <DoctorsTable doctors={doctors ?? []} />
    </AppLayout>
  );
}