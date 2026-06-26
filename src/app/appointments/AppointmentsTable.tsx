"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Appointment = {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

const statusOrder: Record<string, number> = {
  confirmed: 1,
  pending: 2,
  cancelled: 3,
  completed: 4,
};

function getStatusLabel(status: string) {
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmado";
  if (status === "cancelled") return "Cancelado";
  if (status === "completed") return "Realizado";
  return status;
}

function getStatusClass(status: string) {
  if (status === "pending") return "bg-yellow-500/20 text-yellow-400";
  if (status === "confirmed") return "bg-green-500/20 text-green-400";
  if (status === "cancelled") return "bg-red-500/20 text-red-400";
  if (status === "completed") return "bg-sky-500/20 text-sky-400";
  return "bg-zinc-500/20 text-zinc-400";
}

export default function AppointmentsTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const matchesSearch = appointment.client_name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          status === "all" || appointment.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
      });
  }, [appointments, search, status]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500 md:max-w-sm"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="all">Todos</option>
          <option value="confirmed">Confirmados</option>
          <option value="pending">Pendientes</option>
          <option value="cancelled">Cancelados</option>
          <option value="completed">Realizados</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-4 py-4">Cliente</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Hora</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-t border-zinc-800 hover:bg-zinc-900/60"
              >
                <td className="px-4 py-4">{appointment.client_name}</td>

                <td className="px-4 py-4 text-zinc-400">
                  {appointment.client_email}
                </td>

                <td className="px-4 py-4">{appointment.appointment_date}</td>

                <td className="px-4 py-4">{appointment.appointment_time}</td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <Link
                    href={`/appointments/${appointment.id}`}
                    className="rounded-lg bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  No se encontraron turnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}