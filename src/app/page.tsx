export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        Turnify 🚀
      </h1>

      <p className="mt-4 text-gray-700 text-lg">
        Sistema de gestión de turnos
      </p>

      <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg">
        Comenzar
      </button>
    </main>
  );
}