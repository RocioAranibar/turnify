"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Appointment = {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
};

export default function EditAppointmentForm({
  appointment,
}: {
  appointment: Appointment;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const updatedAppointment = {
      client_name: String(formData.get("client_name") ?? ""),
      client_email: String(formData.get("client_email") ?? ""),
      appointment_date: String(formData.get("appointment_date") ?? ""),
      appointment_time: String(formData.get("appointment_time") ?? ""),
      status: String(formData.get("status") ?? "pending"),
      notes: String(formData.get("notes") ?? ""),
    };

    const { data, error } = await supabase
    .from("appointments")
    .update(updatedAppointment)
    .eq("id", appointment.id)
    .select();

    if (error) {
    setMessage(`Error al actualizar: ${error.message}`);
    setLoading(false);
    return;
    }

    if (!data || data.length === 0) {
    setMessage("No se encontró el turno para actualizar.");
    setLoading(false);
    return;
    }

    setLoading(false);
    router.push(`/appointments/${appointment.id}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-blue-400 hover:text-blue-300"
        >
          ← Volver al detalle
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Editar turno</h1>
        <p className="mt-2 text-zinc-400">
          Actualizá la información del turno seleccionado.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div>
            <label className="block text-sm text-zinc-300">
              Nombre del cliente
            </label>
            <input
              name="client_name"
              type="text"
              required
              defaultValue={appointment.client_name}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              name="client_email"
              type="email"
              required
              defaultValue={appointment.client_email}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-300">Fecha</label>
              <input
                name="appointment_date"
                type="date"
                required
                defaultValue={appointment.appointment_date}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300">Hora</label>
              <input
                name="appointment_time"
                type="time"
                required
                defaultValue={appointment.appointment_time.slice(0, 5)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Estado</label>
            <select
              name="status"
              defaultValue={appointment.status}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Notas</label>
            <textarea
              name="notes"
              rows={4}
              defaultValue={appointment.notes ?? ""}
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Guardar cambios"}
          </button>

          {message && <p className="text-sm text-zinc-300">{message}</p>}
        </form>
      </div>
    </main>
  );
}