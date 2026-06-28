"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  client_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

export default function CalendarView({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const router = useRouter();

  const events = appointments
    .filter(
      (appointment) =>
        appointment.status === "confirmed" || appointment.status === "pending"
    )
    .map((appointment) => ({
      id: appointment.id,
      title: `${appointment.client_name} ${appointment.appointment_time.slice(
        0,
        5
      )}`,
      date: appointment.appointment_date,
      backgroundColor:
        appointment.status === "confirmed" ? "#16a34a" : "#ca8a04",
      borderColor:
        appointment.status === "confirmed" ? "#16a34a" : "#ca8a04",
    }));

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
    <FullCalendar
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    events={events}
    eventClick={(info) => {
        router.push(`/appointments/${info.event.id}`);
    }}
    height="auto"
    locale="es"
    buttonText={{
        today: "Hoy",
        month: "Mes",
    }}
    headerToolbar={{
        left: "today prev,next",
        center: "title",
        right: "dayGridMonth",
    }}
    />
    </div>
  );
}