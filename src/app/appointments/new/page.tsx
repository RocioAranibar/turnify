"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
export default function NewAppointmentPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const newAppointment = {
      client_name: formData.get("client_name") as string,
      client_email: formData.get("client_email") as string,
      appointment_date: formData.get("appointment_date") as string,
      appointment_time: formData.get("appointment_time") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    };

    const { error } = await supabase
    .from("appointments")
    .insert(newAppointment);

    if (error) {
    setMessage(`Error al guardar: ${error.message}`);
    setLoading(false);
    return;
    } else {
    setMessage("Turno guardado correctamente.");

    const form = event.target as HTMLFormElement;
    form.reset();
    }

    setLoading(false);
  }
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
          ← Volver a turnos
        </Link>
        <h1 className="text-3xl font-bold">Nuevo turno</h1>
        <p className="mt-2 text-zinc-400">
          Registrá un nuevo turno para un cliente.
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
              placeholder="Juan Pérez"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              name="client_email"
              type="email"
              required
              placeholder="juan@email.com"
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
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300">Hora</label>
              <input
                name="appointment_time"
                type="time"
                required
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-300">Estado</label>
            <select
              name="status"
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
              placeholder="Información adicional..."
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar turno"}
          </button>

          {message && <p className="text-sm text-zinc-300">{message}</p>}
        </form>
      </div>
    </main>
  );
}