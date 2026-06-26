"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelAppointmentButton({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    const confirmed = window.confirm(
      "¿Seguro que querés cancelar este turno?"
    );

    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId);

    if (error) {
      alert(`Error al cancelar: ${error.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/appointments");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={loading}
      className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Cancelando..." : "Cancelar turno"}
    </button>
  );
}