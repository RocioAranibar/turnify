"use client";

import { getBusyHoursByDate } from "@/lib/appointments";
import { availableHours } from "@/lib/schedule";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";

const today = getTodayLocal();

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isPastTimeToday(date: string, time: string) {
  if (date !== today) return false;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  return time <= currentTime;
}

export default function NewAppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [loadingHours, setLoadingHours] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [busyHours, setBusyHours] = useState<string[]>([]);

  async function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const date = event.target.value;
    setSelectedDate(date);
    setBusyHours([]);
    setMessage("");

    if (!date) return;

    setLoadingHours(true);

    try {
      const busy = await getBusyHoursByDate(date);
      setBusyHours(busy);
    } catch {
      setMessage("No se pudieron cargar los horarios ocupados.");
    } finally {
      setLoadingHours(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const appointmentDate = String(formData.get("appointment_date") ?? "");
    const appointmentTime = String(formData.get("appointment_time") ?? "");

    if (appointmentDate < today) {
      setMessage("La fecha del turno no puede ser anterior a hoy.");
      setLoading(false);
      return;
    }

    if (isPastTimeToday(appointmentDate, appointmentTime)) {
      setMessage("No podés reservar un horario que ya pasó.");
      setLoading(false);
      return;
    }

    const updatedBusyHours = await getBusyHoursByDate(appointmentDate);

    if (updatedBusyHours.includes(appointmentTime)) {
      setMessage("Ese horario ya fue ocupado por otro turno.");
      setLoading(false);
      return;
    }

    const newAppointment = {
      client_name: String(formData.get("client_name") ?? ""),
      client_email: String(formData.get("client_email") ?? ""),
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: String(formData.get("status") ?? "pending"),
      notes: String(formData.get("notes") ?? ""),
    };

    const { error } = await supabase.from("appointments").insert(newAppointment);

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("Turno guardado correctamente.");
    form.reset();
    setSelectedDate("");
    setBusyHours([]);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/appointments" className="text-blue-400 hover:text-blue-300">
          ← Volver a turnos
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Nuevo turno</h1>
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
                min={today}
                value={selectedDate}
                onChange={handleDateChange}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-300">Hora</label>
              <select
                name="appointment_time"
                required
                disabled={!selectedDate || loadingHours}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingHours
                    ? "Cargando horarios..."
                    : selectedDate
                    ? "Seleccioná un horario"
                    : "Primero elegí una fecha"}
                </option>

                {availableHours.map((hour) => {
                  const isBusy = busyHours.includes(hour);
                  const isPast = isPastTimeToday(selectedDate, hour);
                  const disabled = isBusy || isPast;

                  return (
                    <option key={hour} value={hour} disabled={disabled}>
                      {isBusy
                        ? `${hour} hs - Ocupado`
                        : isPast
                        ? `${hour} hs - Horario pasado`
                        : `${hour} hs`}
                    </option>
                  );
                })}
              </select>
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