"use client";

import { CalendarDays, Pencil, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Doctor = {
  id: string;
  full_name: string;
  email: string | null;
  license: string;
  specialty: string;
  active: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DoctorsTable({ doctors }: { doctors: Doctor[] }) {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [status, setStatus] = useState("active");

  const specialties = useMemo(() => {
    return Array.from(new Set(doctors.map((doctor) => doctor.specialty)));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.full_name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
        doctor.license.toLowerCase().includes(search.toLowerCase());

      const matchesSpecialty =
        specialty === "all" || doctor.specialty === specialty;

      const matchesStatus =
        status === "all" ||
        (status === "active" && doctor.active) ||
        (status === "inactive" && !doctor.active);

      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [doctors, search, specialty, status]);

  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg">
      <div className="grid gap-4 md:grid-cols-[1fr_220px_160px]">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3">
          <Search size={18} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar médico..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-zinc-500"
          />
        </div>

        <select
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
        >
          <option value="all">Todas las especialidades</option>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
        >
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="all">Todos</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-xs uppercase text-zinc-400">
            <tr>
              <th className="px-4 py-4">Médico</th>
              <th className="px-4 py-4">Especialidad</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctors.map((doctor) => (
              <tr
                key={doctor.id}
                className="border-t border-zinc-800 hover:bg-zinc-950/60"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold">
                      {getInitials(doctor.full_name)}
                    </div>

                    <div>
                      <p className="font-semibold">{doctor.full_name}</p>
                      <p className="text-xs text-zinc-500">{doctor.license}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-zinc-300">
                  {doctor.specialty}
                </td>

                <td className="px-4 py-4 text-zinc-400">
                  {doctor.email || "Sin email"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      doctor.active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {doctor.active ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex gap-3 text-zinc-400">
                    <Link
                      href={`/doctors/${doctor.id}/edit`}
                      className="hover:text-white"
                    >
                      <Pencil size={17} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  No se encontraron médicos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Mostrando {filteredDoctors.length} médicos
      </p>
    </section>
  );
}