import Link from "next/link";
import RegisterForm from "./RegisterForm";
export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <section className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-400">
              Turnify
            </Link>

            <h1 className="mt-10 text-4xl font-bold">Creá tu cuenta</h1>

            <p className="mt-4 max-w-md text-zinc-400">
              Registrate para comenzar a gestionar turnos desde un único panel.
            </p>
          </div>

          <RegisterForm />
        </section>
      </div>
    </main>
  );
}