"use client";

import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";
import { Search, User } from "lucide-react";
import { useMemo, useState } from "react";

type Patient = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  dni: string | null;
};

type PatientSearchProps = {
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onClearPatient: () => void;
};

export default function PatientSearch({
  selectedPatient,
  onSelectPatient,
  onClearPatient,
}: PatientSearchProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(value: string) {
    setSearch(value);

    if (value.trim().length < 2) {
      setPatients([]);
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPatients([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("id, full_name, email, phone, dni")
      .eq("user_id", user.id)
      .or(
        `full_name.ilike.%${value}%,email.ilike.%${value}%,dni.ilike.%${value}%`
      )
      .limit(5);

    if (!error) {
      setPatients(data ?? []);
    }

    setLoading(false);
  }

  if (selectedPatient) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600">
            <User size={20} />
          </div>

          <div className="flex-1">
            <p className="font-semibold">{selectedPatient.full_name}</p>
            <p className="mt-1 text-sm text-zinc-400">
              {selectedPatient.email}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              DNI: {selectedPatient.dni || "Sin DNI"} · Tel:{" "}
              {selectedPatient.phone || "Sin teléfono"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClearPatient}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Cambiar
          </button>
        </div>

        <input type="hidden" name="patient_id" value={selectedPatient.id} />
        <input
          type="hidden"
          name="client_name"
          value={selectedPatient.full_name}
        />
        <input
          type="hidden"
          name="client_email"
          value={selectedPatient.email}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm text-zinc-300">Paciente</label>

      <div className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3">
        <Search size={18} className="text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Buscar por nombre, email o DNI..."
          className="w-full bg-transparent outline-none placeholder:text-zinc-500"
        />
      </div>

      {loading && <p className="mt-3 text-sm text-zinc-400">Buscando...</p>}

      {!loading && search.length >= 2 && patients.length === 0 && (
        <p className="mt-3 text-sm text-zinc-400">
          No se encontraron pacientes.
        </p>
      )}

      {patients.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelectPatient(patient)}
              className="flex w-full items-center gap-3 border-b border-zinc-800 px-4 py-3 text-left last:border-b-0 hover:bg-zinc-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700">
                <User size={17} />
              </div>

              <div>
                <p className="font-semibold">{patient.full_name}</p>
                <p className="text-sm text-zinc-400">
                  {patient.email} · DNI: {patient.dni || "Sin DNI"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}