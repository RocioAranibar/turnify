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

  async function hasScheduleConflict() {
    const { data: currentAppointment, error: currentError } = await supabase
      .from("appointments")
      .select("appointment_date, appointment_time, doctor_id, office")
      .eq("id", appointmentId)
      .single();

    if (currentError || !currentAppointment) {
      throw new Error("No se pudo obtener el turno actual.");
    }

    const { data: conflicts, error: conflictError } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", currentAppointment.appointment_date)
      .eq("appointment_time", currentAppointment.appointment_time)
      .in("status", ["pending", "confirmed"])
      .neq("id", appointmentId)
      .or(
        `doctor_id.eq.${currentAppointment.doctor_id},office.eq.${currentAppointment.office}`
      );

    if (conflictError) {
      throw new Error(conflictError.message);
    }

    return (conflicts ?? []).length > 0;
  }

  async function updateStatus(newStatus: string) {
    setLoading(true);

    if (newStatus === "pending" || newStatus === "confirmed") {
      try {
        const conflict = await hasScheduleConflict();

        if (conflict) {
          alert(
            "No se puede reactivar o confirmar este turno porque el médico o el consultorio ya tiene otro turno en ese horario."
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "No se pudo validar la disponibilidad del turno."
        );
        setLoading(false);
        return;
      }
    }

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
        className="rounded-xl border border-green-500/50 px-5 py-3 text-center font-semibold text-green-400 hover:bg-green-500/10 disabled:opacity-60"
      >
        {loading ? "Confirmando..." : "Confirmar turno"}
      </button>
    );
  }

  if (status === "confirmed") {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("completed")}
        className="w-full rounded-xl border border-green-700 bg-green-500/10 px-5 py-3 font-semibold text-green-400 transition hover:bg-green-500/20"
      >
        {loading ? "Actualizando..." : "Marcar como realizado"}
      </button>
    );
  }

if (status === "cancelled") {
  return (
    <div className="rounded-xl border border-red-800 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      Este turno fue cancelado y no puede reactivarse.
    </div>
  );
}

  if (status === "completed") {
    return (
      <p className="rounded-xl border border-sky-800 bg-sky-500/10 px-4 py-3 text-sm text-sky-300">
        Este turno ya fue realizado.
      </p>
    );
  }

  return null;
}