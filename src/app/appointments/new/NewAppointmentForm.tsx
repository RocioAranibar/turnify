"use client";

import AppLayout from "@/components/AppLayout";
import { availableHours } from "@/lib/schedule";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import { useEffect, useMemo, useState } from "react";
import PatientSearch from "./PatientSearch";

type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  active: boolean;
};

type Patient = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  dni: string | null;
};

const offices = ["Consultorio 1", "Consultorio 2", "Consultorio 3"];

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

export default function NewAppointmentForm() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [message, setMessage] = useState("");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    async function loadDoctors() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoadingDoctors(false);
      return;
    }

    const { data, error } = await supabase
      .from("doctors")
      .select("id, full_name, specialty, active")
      .eq("user_id", user.id)
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

    const form = event.currentTarget;
    const formData = new FormData(form);

    const patientId = String(formData.get("patient_id") ?? "");
    const appointmentDate = String(formData.get("appointment_date") ?? "");
    const appointmentTime = String(formData.get("appointment_time") ?? "");
    const specialty = String(formData.get("specialty") ?? "");
    const doctorId = String(formData.get("doctor_id") ?? "");
    const office = String(formData.get("office") ?? "");

    const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);

    if (!patientId || !selectedPatient) {
      setMessage("Seleccioná un paciente.");
      setLoading(false);
      return;
    }

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
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("No hay usuario autenticado.");
      setLoading(false);
      return;
    }
    const newAppointment = {
      patient_id: patientId,
      client_name: selectedPatient.full_name,
      client_email: selectedPatient.email,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: "confirmed",
      notes: String(formData.get("notes") ?? ""),
      specialty,
      doctor_id: doctorId,
      doctor: selectedDoctor.full_name,
      office,
      user_id: user.id,
    };

    const { error } = await supabase.from("appointments").insert(newAppointment);

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage("Turno guardado correctamente.");
    form.reset();
    setSelectedPatient(null);
    setSelectedSpecialty("");
    setSelectedDoctorId("");
    setSelectedDate("");
    setLoading(false);
  }

  return (
    <AppLayout>
      <div className="w-full max-w-7xl">
        <h1 className="mt-6 text-3xl font-bold">Nuevo turno</h1>
        <p className="mt-2 text-zinc-400">
          Completá los datos para agendar un nuevo turno.
        </p>

        <div className="mt-8 grid gap-6 xl:grid-cols-[2fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <PatientSearch
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onClearPatient={() => setSelectedPatient(null)}
            />

            <div className="grid gap-5 lg:grid-cols-2">
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
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
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
                  disabled={!selectedDate}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {selectedDate
                      ? "Seleccioná un horario"
                      : "Primero elegí una fecha"}
                  </option>

                  {availableHours.map((hour) => {
                    const isPast = isPastTimeToday(selectedDate, hour);

                    return (
                      <option key={hour} value={hour} disabled={isPast}>
                        {isPast ? `${hour} hs - Horario pasado` : `${hour} hs`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-300">
                  Consultorio
                </label>
                <select
                  name="office"
                  required
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Seleccioná</option>
                  {offices.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
              </div>
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

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Información importante</h2>

            <ul className="mt-6 space-y-4 text-sm leading-6 text-zinc-400">
              <li>• Primero seleccioná un paciente registrado.</li>
              <li>• Los turnos tienen una duración predeterminada de 30 minutos.</li>
              <li>
                • El horario se valida según la disponibilidad del médico y del
                consultorio.
              </li>
              <li>• Podés cancelar o modificar el turno más tarde desde la agenda.</li>
            </ul>

            <div className="mt-8 flex justify-center rounded-2xl bg-zinc-950/60 p-6 text-6xl">
              📅
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}