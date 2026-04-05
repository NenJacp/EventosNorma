"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Ingresa un correo válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setWarning("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await apiFetch<LoginResponse>("/api/Users/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      saveSession({
        token: data?.token,
        email: data?.email || form.email,
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const normalizedMessage = err.message.toLowerCase();

        if (
          err.status === 401 &&
          normalizedMessage.includes("verificar tu correo")
        ) {
          setWarning(err.message);
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        } else {
          setError(err.message);
        }
      } else {
        setError("No se pudo iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Iniciar sesión"
      description="Ingresa tus credenciales para acceder al sistema"
      sideTitle="Organiza, crea y administra tus eventos en un solo lugar."
      sideText="Accede a tu cuenta para gestionar asistentes, fechas, detalles y nuevas experiencias."
      sideFooter="Si tu correo aún no está validado, te enviaremos a la pantalla de verificación."
      accent="blue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {error && <AlertMessage type="error" message={error} />}
        {warning && <AlertMessage type="warning" message={warning} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-slate-900 transition hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}