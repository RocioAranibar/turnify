"use client";

import AppLayout from "@/components/AppLayout";
import { getBusyHoursByDateExcludingAppointment } from "@/lib/appointments";
import { availableHours } from "@/lib/schedule";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMaxDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 18);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = getTodayLocal();
const maxDate = getMaxDate();

type Appointment = {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
};

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

export default function EditAppointmentForm({
  appointment,
}: {
  appointment: Appointment;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(appointment.appointment_date);
  const [busyHours, setBusyHours] = useState<string[]>([]);

  async function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const date = event.target.value;
    setSelectedDate(date);
    setBusyHours([]);

    if (!date) return;

    try {
      const busy = await getBusyHoursByDateExcludingAppointment(
        date,
        appointment.id
      );
      setBusyHours(busy);
    } catch {
      setMessage("No se pudieron cargar los horarios ocupados.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const clientEmail = String(formData.get("client_email") ?? "").trim();
    const appointmentDate = String(formData.get("appointment_date") ?? "");
    const appointmentTime = String(formData.get("appointment_time") ?? "");

    if (!emailRegex.test(clientEmail)) {
      setMessage(
        "Ingresá un correo válido. Ej: usuario@gmail.com o usuario@empresa.com.ar"
      );
      setLoading(false);
      return;
    }

    if (appointmentDate < today) {
      setMessage("La fecha del turno no puede ser anterior a hoy.");
      setLoading(false);
      return;
    }

    if (appointmentDate > maxDate) {
      setMessage("Solo podés reservar turnos hasta un año y medio desde hoy.");
      setLoading(false);
      return;
    }

    const updatedBusyHours = await getBusyHoursByDateExcludingAppointment(
      appointmentDate,
      appointment.id
    );

    if (updatedBusyHours.includes(appointmentTime)) {
      setMessage("Ese horario ya está ocupado por otro turno.");
      setLoading(false);
      return;
    }

    const updatedAppointment = {
      client_name: String(formData.get("client_name") ?? ""),
      client_email: clientEmail,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
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

    router.push(`/appointments/${appointment.id}`);
    router.refresh();
  }

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-blue-400 hover:text-blue-300"
        >
          ← Volver al detalle
        </Link>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Editar turno</h1>
          <p className="mt-2 text-zinc-400">
            Modificá los datos del turno.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
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
                  pattern="^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$"
                  title="Ingresá un correo válido. Ej: usuario@gmail.com o usuario@empresa.com.ar"
                  defaultValue={appointment.client_email}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300">Fecha</label>
                <input
                  name="appointment_date"
                  type="date"
                  required
                  min={today}
                  max={maxDate}
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
                  defaultValue={appointment.appointment_time.slice(0, 5)}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {availableHours.map((hour) => {
                    const isBusy = busyHours.includes(hour);

                    return (
                      <option key={hour} value={hour} disabled={isBusy}>
                        {isBusy ? `${hour} hs - Ocupado` : `${hour} hs`}
                      </option>
                    );
                  })}
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
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href={`/appointments/${appointment.id}`}
                className="rounded-xl bg-zinc-700 px-5 py-3 font-semibold hover:bg-zinc-600"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Actualizando..." : "Guardar cambios"}
              </button>
            </div>

            {message && <p className="text-sm text-zinc-300">{message}</p>}
          </form>
        </section>
      </div>
    </AppLayout>
  );
}