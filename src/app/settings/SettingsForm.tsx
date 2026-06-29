"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const emailRegex =
  /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$/i;

export default function SettingsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setEmail(data.user.email ?? "");
        setName(String(data.user.user_metadata?.name ?? ""));
      }
    }

    loadUser();
  }, []);

  async function updateProfile() {
    setMessage("");

    if (!email || !emailRegex.test(email)) {
      setMessage(
        "Ingresá un correo válido. Ej: usuario@gmail.com"
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        name,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Perfil actualizado correctamente.");
  }

  async function updatePassword() {
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setMessage("Contraseña actualizada correctamente.");
  }

  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold">Perfil</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm text-zinc-300">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            pattern="^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)?(gmail|outlook|hotmail|yahoo)\.com$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.(com\.ar|com|org|net|edu|gov)$"
            title="Ingresá un correo válido. Ej: usuario@gmail.com o usuario@empresa.com.ar"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={updateProfile}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
        >
          Guardar cambios
        </button>
      </div>

      <div className="my-8 border-t border-zinc-800" />

      <h2 className="text-xl font-semibold">Cambiar contraseña</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm text-zinc-300">Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-300">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={updatePassword}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
        >
          Actualizar contraseña
        </button>
      </div>

      {message && <p className="mt-5 text-sm text-zinc-300">{message}</p>}
    </section>
  );
}