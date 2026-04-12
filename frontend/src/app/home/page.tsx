"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">
          Home de usuario
        </h1>
        <p className="mt-2 text-slate-600">
          Esta vista es para los usuarios normales.
        </p>
      </div>
    </div>
  );
}