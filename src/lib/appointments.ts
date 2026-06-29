import { supabase } from "@/lib/supabase";

export async function getBusyHoursByDate(date: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((appointment) =>
    String(appointment.appointment_time).slice(0, 5)
  );
}
export async function getBusyHoursByDateExcludingAppointment(
  date: string,
  appointmentId: string
) {
  const { data, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"])
    .neq("id", appointmentId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((appointment) =>
    String(appointment.appointment_time).slice(0, 5)
  );
}