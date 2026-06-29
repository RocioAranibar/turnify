"use client";

import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
    >
      <LogOut size={18} />
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}