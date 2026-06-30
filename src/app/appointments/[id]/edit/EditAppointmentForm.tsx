"use client";

import AppLayout from "@/components/AppLayout";
import { availableHours } from "@/lib/schedule";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  specialty: string | null;
  doctor: string | null;
  doctor_id: string | null;
  office: string | null;
};

type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  active: boolean;
};

const offices = ["Consultorio 1", "Consultorio 2", "Consultorio 3"];

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

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

function isPastTimeToday(date: string, time: string) {
  if (date !== today) return false;

  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  return time <= currentTime;
}

export default function EditAppointmentForm({
  appointment,
}: {
  appointment: Appointment;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [message, setMessage] = useState("");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    appointment.specialty ?? ""
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    appointment.doctor_id ?? ""
  );
  const [selectedDate, setSelectedDate] = useState(appointment.appointment_date);

  useEffect(() => {
    async function loadDoctors() {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, specialty, active")
        .eq("active", true)
        .order("full_name");

      if (error) {
        setMessage(`Error al cargar médicos: ${error.message}`);
        setLoadingDoctors(false);
        return;
      }

      setDoctors(data ?? []);
      setLoadingDoctors(false);
    }

    loadDoctors();
  }, []);

  const specialties = useMemo(() => {
    return Array.from(new Set(doctors.map((doctor) => doctor.specialty)));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => doctor.specialty === selectedSpecialty);
  }, [doctors, selectedSpecialty]);

  async function isSlotUnavailable({
    date,
    time,
    doctorId,
    office,
  }: {
    date: string;
    time: string;
    doctorId: string;
    office: string;
  }) {
    const { data, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("appointment_time", time)
      .in("status", ["pending", "confirmed"])
      .neq("id", appointment.id)
      .or(`doctor_id.eq.${doctorId},office.eq.${office}`);

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).length > 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const clientEmail = String(formData.get("client_email") ?? "").trim();
    const appointmentDate = String(formData.get("appointment_date") ?? "");
    const appointmentTime = String(formData.get("appointment_time") ?? "");
    const specialty = String(formData.get("specialty") ?? "");
    const doctorId = String(formData.get("doctor_id") ?? "");
    const office = String(formData.get("office") ?? "");

    const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);

    if (!specialty) {
      setMessage("Seleccioná una especialidad.");
      setLoading(false);
      return;
    }

    if (!doctorId || !selectedDoctor) {
      setMessage("Seleccioná un médico.");
      setLoading(false);
      return;
    }

    if (!office) {
      setMessage("Seleccioná un consultorio.");
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

    if (isPastTimeToday(appointmentDate, appointmentTime)) {
      setMessage("No podés reservar un horario que ya pasó.");
      setLoading(false);
      return;
    }

    try {
      const unavailable = await isSlotUnavailable({
        date: appointmentDate,
        time: appointmentTime,
        doctorId,
        office,
      });

      if (unavailable) {
        setMessage(
          "Ese horario no está disponible: el médico o el consultorio ya tiene un turno."
        );
        setLoading(false);
        return;
      }
    } catch {
      setMessage("No se pudo validar la disponibilidad del turno.");
      setLoading(false);
      return;
    }

    const updatedAppointment = {
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: String(formData.get("status") ?? "pending"),
      notes: String(formData.get("notes") ?? ""),
      specialty,
      doctor_id: doctorId,
      doctor: selectedDoctor.full_name,
      office,
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
          <p className="mt-2 text-zinc-400">Modificá los datos del turno.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm text-zinc-300">
                  Nombre del paciente
                </label>
                <input
                  name="client_name"
                  type="text"
                  required
                  defaultValue={appointment.client_name}
                  disabled
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
                  disabled
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300">
                  Especialidad
                </label>
                <select
                  name="specialty"
                  required
                  value={selectedSpecialty}
                  disabled={loadingDoctors}
                  onChange={(event) => {
                    setSelectedSpecialty(event.target.value);
                    setSelectedDoctorId("");
                  }}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-60"
                >
                  <option value="">
                    {loadingDoctors
                      ? "Cargando especialidades..."
                      : "Seleccioná una especialidad"}
                  </option>

                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-300">Médico</label>
                <select
                  name="doctor_id"
                  required
                  value={selectedDoctorId}
                  disabled={!selectedSpecialty}
                  onChange={(event) => setSelectedDoctorId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-60"
                >
                  <option value="">
                    {selectedSpecialty
                      ? "Seleccioná un médico"
                      : "Primero elegí una especialidad"}
                  </option>

                  {filteredDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-300">
                  Consultorio
                </label>
                <select
                  name="office"
                  required
                  defaultValue={appointment.office ?? ""}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Seleccioná un consultorio</option>
                  {offices.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
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
                  onChange={(event) => setSelectedDate(event.target.value)}
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
                    const isPast = isPastTimeToday(selectedDate, hour);

                    return (
                      <option key={hour} value={hour} disabled={isPast}>
                        {isPast
                          ? `${hour} hs - Horario pasado`
                          : `${hour} hs`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-300">Estado</label>
                <select
                  name="status"
                  defaultValue={appointment.status}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="confirmed">Confirmado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-zinc-300">Notas</label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={appointment.notes ?? ""}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                />
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