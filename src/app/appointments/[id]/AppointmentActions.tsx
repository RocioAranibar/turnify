"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AppointmentActionsProps = {
  appointmentId: string;
  status: string;
};

export default function AppointmentActions({
  appointmentId,
  status,
}: AppointmentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      alert(`Error al actualizar el turno: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  if (status === "pending") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("confirmed")}
        className="rounded-xl bg-green-600 px-4 py-2 font-semibold hover:bg-green-500 disabled:opacity-60"
      >
        {loading ? "Confirmando..." : "Confirmar"}
      </button>
    );
  }

  if (status === "confirmed") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("completed")}
        className="rounded-xl bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? "Actualizando..." : "Realizado"}
      </button>
    );
  }

  if (status === "cancelled") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("pending")}
        className="rounded-xl bg-zinc-700 px-4 py-2 font-semibold hover:bg-zinc-600 disabled:opacity-60"
      >
        {loading ? "Reactivando..." : "Reactivar"}
      </button>
    );
  }

    if (status === "completed") {
    return (
        <p className="rounded-xl border border-sky-800 bg-sky-500/10 px-4 py-2 text-sm text-sky-300">
        Este turno ya fue realizado.
        </p>
    );
    }

    return null;
}