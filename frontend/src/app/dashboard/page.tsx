"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { clearSession, getFullName, getSession } from "@/lib/auth";
import type { LogoutResponse } from "@/types/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuario");
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUserName(getFullName(session));
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);

      await apiFetch<LogoutResponse>("/api/Users/logout", {
        method: "POST",
      });

      clearSession();
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        console.error(err.message);
      }
      clearSession();
      router.push("/login");
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Bienvenido a tu panel principal
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Usuario</p>
                <p className="text-sm font-semibold text-slate-900">
                  {userName}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loadingLogout}
              className="flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              <LogOut size={16} />
              {loadingLogout ? "Saliendo..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, {userName}
          </h2>
          <p className="mt-2 text-slate-600">
            Tu autenticación ya funciona correctamente. Desde aquí podremos
            construir después los módulos de eventos, asistentes, categorías y
            administración.
          </p>
        </div>
      </section>
    </main>
  );
}