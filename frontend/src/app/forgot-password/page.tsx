"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import AlertMessage from "@/components/AlertMessage";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      email: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error( "El correo electrónico es obligatorio.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error( "Ingresa un correo válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await apiFetch("/api/Users/forgot-password", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error( err.message);
      } else {
        toast.error( "No se pudo procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        title="Código enviado"
        description="Revisa tu bandeja de entrada"
        sideTitle="Restablece tu contraseña"
        sideText="Si el correo existe en nuestro sistema, recibirás un código de verificación."
        sideFooter="Usa el código para crear una nueva contraseña."
        accent="blue"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p className="text-gray-600">
            Hemos enviado un código de verificación a{" "}
            <span className="font-medium text-gray-900">{form.email}</span>
          </p>

          <p className="text-sm text-gray-500">
            Si no lo recibes en unos minutos, revisa tu carpeta de spam.
          </p>

          <Link
            href={`/reset-password?email=${encodeURIComponent(form.email)}`}
            className="mt-4 inline-block w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Ingresar código
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Olvidé mi contraseña"
      description="Ingresa tu correo electrónico"
      sideTitle="Restablece tu contraseña"
      sideText="Si el correo existe en nuestro sistema, recibirás un código de verificación."
      sideFooter="Usa el código para crear una nueva contraseña."
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        ¿Recordaste tu contraseña?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}