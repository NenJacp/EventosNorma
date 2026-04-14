"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import AuthCardLayout from "@/components/AuthCardLayout";
import { apiFetch, ApiError } from "@/lib/api";
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

      toast.success(`Bienvenido, ${data?.firstName || "usuario"}`);

      if (data?.role === "Admin") {
        router.push("/dashboard");
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
    <AuthCardLayout
      title="Iniciar sesión"
      description="Accede a tu panel para gestionar la información de tus eventos."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-700 transition hover:underline"
          >
            Regístrate aquí
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Contraseña
          </label>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-end pt-1">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-blue-700 transition hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Entrar al sistema"}
        </button>
      </form>
    </AuthCardLayout>
  );
}