"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import AuthCardLayout from "@/components/AuthCardLayout";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

export default function ForgotPasswordPage() {
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
      toast.error("El correo electrónico es obligatorio.");
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

      await apiFetch("/api/Users/forgot-password", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCardLayout
        eyebrow="Código enviado"
        title="Revisa tu correo"
        description="Si el correo existe en nuestro sistema, recibirás un código de verificación."
        sideTitle={
          <>
            Restablece tu <span className="text-blue-400">contraseña</span>
          </>
        }
        sideDescription="Te enviaremos un código para que puedas validar tu identidad y crear una nueva contraseña de forma segura."
        statusText="Envío disponible"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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

          <p className="text-sm leading-6 text-gray-600">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-gray-900">{form.email}</span>
          </p>

          <p className="text-sm text-gray-500">
            Si no lo recibes en unos minutos, revisa tu carpeta de spam.
          </p>

          <Link
            href={`/reset-password?email=${encodeURIComponent(form.email)}`}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700"
          >
            Ingresar código
          </Link>

          <p className="pt-2 text-sm text-gray-500">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-700 transition hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </AuthCardLayout>
    );
  }

  return (
    <AuthCardLayout
      eyebrow="Recuperación"
      title="Olvidé mi contraseña"
      description="Ingresa tu correo electrónico para enviarte un código de verificación."
      sideTitle={
        <>
          Recupera el acceso a tu <span className="text-blue-400">cuenta</span>
        </>
      }
      sideDescription="Si el correo existe en nuestro sistema, recibirás un código para continuar con el restablecimiento de tu contraseña."
      statusText="Recuperación disponible"
      footer={
        <>
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-700 transition hover:underline"
          >
            Iniciar sesión
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>
      </form>
    </AuthCardLayout>
  );
}