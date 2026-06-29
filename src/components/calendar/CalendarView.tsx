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

  const groupedByDate = appointments
    .filter(
      (appointment) =>
        appointment.status === "confirmed" || appointment.status === "pending"
    )
    .reduce<Record<string, { confirmed: number; pending: number }>>(
      (acc, appointment) => {
        const date = appointment.appointment_date;

        if (!acc[date]) {
          acc[date] = {
            confirmed: 0,
            pending: 0,
          };
        }

        if (appointment.status === "confirmed") {
          acc[date].confirmed += 1;
        }

        if (appointment.status === "pending") {
          acc[date].pending += 1;
        }

        return acc;
      },
      {}
    );

  const events = Object.entries(groupedByDate).flatMap(([date, counts]) => {
    const dayEvents = [];

    if (counts.confirmed > 0) {
        dayEvents.push({
        title: `${counts.confirmed} confirmado${counts.confirmed > 1 ? "s" : ""}`,
        date,
        backgroundColor: "#15803d",
        borderColor: "#15803d",
        textColor: "#dcfce7",
        });
    }

    if (counts.pending > 0) {
        dayEvents.push({
        title: `${counts.pending} pendiente${counts.pending > 1 ? "s" : ""}`,
        date,
        backgroundColor: "#ca8a04",
        borderColor: "#ca8a04",
        textColor: "#fef3c7",
        });
    }

    return dayEvents;
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
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
        dateClick={(info) => {
          router.push(`/appointments?date=${info.dateStr}`);
        }}
      />
    </div>
  );
}