"use client";

import { Eye, Pencil, Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Appointment = {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor?: string | null;
  specialty?: string | null;
};

function getStatusLabel(status: string) {
  if (status === "confirmed") return "Confirmado";
  if (status === "completed") return "Realizado";
  if (status === "cancelled") return "Cancelado";
  return status;
}

function getStatusClass(status: string) {
  if (status === "confirmed") return "bg-green-500/20 text-green-400";
  if (status === "completed") return "bg-blue-500/20 text-blue-400";
  if (status === "cancelled") return "bg-red-500/20 text-red-400";
  return "bg-zinc-500/20 text-zinc-400";
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR");
}

export default function AppointmentsTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") ?? "";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState(initialDate);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const text = `${appointment.client_name} ${appointment.client_email} ${
        appointment.doctor ?? ""
      } ${appointment.specialty ?? ""}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus =
        status === "all" || appointment.status === status;
      const matchesDate =
        !dateFilter || appointment.appointment_date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, status, dateFilter]);

  return (
    <>
      <div className="mt-8 flex gap-6 border-b border-zinc-800">
        {[
          { label: "Todos", value: "all" },
          { label: "Confirmados", value: "confirmed" },
          { label: "Realizados", value: "completed" },
          { label: "Cancelados", value: "cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={`pb-3 text-sm font-medium ${
              status === tab.value
                ? "border-b-2 border-violet-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_130px]">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
          <Search size={18} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar turno..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-zinc-500"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-violet-500"
        />


      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Hora</th>
              <th className="px-4 py-4">Paciente</th>
              <th className="px-4 py-4">Médico</th>
              <th className="px-4 py-4">Especialidad</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-t border-zinc-800 hover:bg-zinc-950/60"
              >
                <td className="px-4 py-4">{formatDate(appointment.appointment_date)}</td>
                <td className="px-4 py-4">{appointment.appointment_time.slice(0, 5)}</td>
                <td className="px-4 py-4">{appointment.client_name}</td>
                <td className="px-4 py-4 text-zinc-300">{appointment.doctor || "Sin médico"}</td>
                <td className="px-4 py-4 text-zinc-300">{appointment.specialty || "Sin especialidad"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${getStatusClass(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/appointments/${appointment.id}`)}
                      className="rounded-lg bg-zinc-800 p-2 hover:bg-zinc-700"
                    >
                      <Eye size={17} />
                    </button>

                    {appointment.status !== "cancelled" &&
                      appointment.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/appointments/${appointment.id}/edit`)
                          }
                          className="rounded-lg bg-zinc-800 p-2 hover:bg-zinc-700"
                        >
                          <Pencil size={17} />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
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