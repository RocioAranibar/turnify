import AppLayout from "@/components/AppLayout";
import SettingsForm from "./SettingsForm";
export default function SettingsPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="mt-2 text-zinc-400">
          Gestioná las preferencias del sistema.
        </p>
      </div>

    <SettingsForm />
    </AppLayout>
  );
}