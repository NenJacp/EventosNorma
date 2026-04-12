"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthShell from "@/components/AuthShell";
import AlertMessage from "@/components/AlertMessage";
import { apiFetch, ApiError } from "@/lib/api";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "@/types/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState<ForgotPasswordRequest>({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      email: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      setError("Debes ingresar tu correo electrónico.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      await apiFetch<ForgotPasswordResponse>("/api/Users/forgot-password", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("Se envió el código de recuperación correctamente.");

      setTimeout(() => {
        router.push(
          `/reset-password?email=${encodeURIComponent(form.email)}`
        );
      }, 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "No se pudo procesar la solicitud.");
        return;
      }

      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar contraseña"
      description="Ingresa tu correo para recibir el código de recuperación."
      sideTitle="Recupera el acceso"
      sideText="Te enviaremos un código para que puedas restablecer tu contraseña de forma segura."
      sideFooter="Protegemos tu cuenta y tu información en todo momento."
      accent="blue"
    >
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-slate-700 hover:via-blue-800 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>

        <p className="text-center text-sm text-slate-600">
          <Link
            href="/login"
            className="font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Volver a iniciar sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}