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
        appointment.status === "confirmed" ||
        appointment.status === "completed" ||
        appointment.status === "cancelled"
    )
    .reduce<
      Record<
        string,
        {
          confirmed: number;
          completed: number;
          cancelled: number;
        }
      >
    >((acc, appointment) => {
      const date = appointment.appointment_date;

      if (!acc[date]) {
        acc[date] = {
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };
      }

      if (appointment.status === "confirmed") {
        acc[date].confirmed += 1;
      }

      if (appointment.status === "completed") {
        acc[date].completed += 1;
      }

      if (appointment.status === "cancelled") {
        acc[date].cancelled += 1;
      }

      return acc;
    }, {});

  const events = Object.entries(groupedByDate).flatMap(([date, counts]) => {
    const dayEvents = [];

    if (counts.confirmed > 0) {
      dayEvents.push({
        title: `${counts.confirmed} confirmado${
          counts.confirmed > 1 ? "s" : ""
        }`,
        date,
        backgroundColor: "#15803d",
        borderColor: "#15803d",
        textColor: "#dcfce7",
      });
    }

    if (counts.completed > 0) {
      dayEvents.push({
        title: `${counts.completed} realizado${
          counts.completed > 1 ? "s" : ""
        }`,
        date,
        backgroundColor: "#0369a1",
        borderColor: "#0369a1",
        textColor: "#e0f2fe",
      });
    }

    if (counts.cancelled > 0) {
      dayEvents.push({
        title: `${counts.cancelled} cancelado${
          counts.cancelled > 1 ? "s" : ""
        }`,
        date,
        backgroundColor: "#b91c1c",
        borderColor: "#b91c1c",
        textColor: "#fee2e2",
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