import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 shadow-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800">Eventos App</h1>
        <p className="mt-3 text-gray-600">
          Bienvenido. Comienza creando tu cuenta o iniciando sesión.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-black px-6 py-3 text-white font-medium"
          >
            Ir a Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-black px-6 py-3 text-black font-medium"
          >
            Ir a Registro
          </Link>
        </div>
      </div>
    </main>
  );
}