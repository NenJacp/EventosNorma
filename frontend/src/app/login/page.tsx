"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import PasswordInput from "@/components/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { toast } from "@/lib/toast";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Todos los campos son obligatorios.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Ingresa un correo válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
        role: data?.role || "User",
      });

      toast.success(`Bienvenido, ${data?.firstName || "usuario"}`);

      if (data?.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const normalizedMessage = err.message.toLowerCase();

        if (
          err.status === 401 &&
          normalizedMessage.includes("verificar tu correo")
        ) {
          toast.warning(err.message);
          router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("No se pudo iniciar sesión.");
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
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <div className="flex items-center justify-center">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-blue-700 transition hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-700 transition hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}