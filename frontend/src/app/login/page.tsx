"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import AuthShell from "@/components/AuthShell";
import AlertMessage from "@/components/AlertMessage";
import { apiFetch, ApiError } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setWarning("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await apiFetch<LoginResponse>("/api/Users/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!response.success || !response.data) {
        setError("No se pudo iniciar sesión.");
        return;
      }

      saveSession(response.data);

      const role = response.data.role?.toLowerCase();

      if (role === "admin") {
        router.push("/admin/home");
      } else {
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (
          err.message
            .toLowerCase()
            .includes("debes verificar tu correo electrónico")
        ) {
          setWarning(err.message);
          return;
        }

        setError(err.message || "Ocurrió un error al iniciar sesión.");
        return;
      }

      setError("Error inesperado al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      description="Accede a tu cuenta para continuar"
      sideTitle="Bienvenido de nuevo"
      sideText="Inicia sesión para continuar en la plataforma y administrar tus eventos de manera rápida y segura."
      sideFooter="Centraliza tu información, organiza eventos y mantén todo bajo control desde un solo lugar."
      accent="blue"
    >
      {error && <AlertMessage type="error" message={error} />}
      {warning && <AlertMessage type="warning" message={warning} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-slate-700">
              Contraseña
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:from-slate-700 hover:via-blue-800 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}