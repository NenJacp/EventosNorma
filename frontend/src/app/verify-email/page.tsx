"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import AlertMessage from "@/components/AlertMessage";
import { apiFetch, ApiError } from "@/lib/api";
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<VerifyEmailRequest>({
    email: "",
    token: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setForm((prev) => ({
        ...prev,
        email: emailFromQuery,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.token.trim()) {
      setError("Debes completar el correo y el código de verificación.");
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
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await apiFetch<VerifyEmailResponse>("/api/Users/verify-email", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess(
        data?.message ||
          data?.detail ||
          "Tu correo fue verificado correctamente."
      );

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo verificar el correo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verificar correo"
      description="Escribe tu correo y el código de autenticación"
      sideTitle="Verifica tu correo para activar tu cuenta."
      sideText="Ingresa el código que te fue enviado por correo electrónico para completar el acceso al sistema."
      sideFooter="Después de verificar tu cuenta podrás iniciar sesión normalmente."
      accent="indigo"
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
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Código de verificación
          </label>
          <input
            type="text"
            name="token"
            value={form.token}
            onChange={handleChange}
            placeholder="Ej. 117255"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-indigo-700 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Verificar correo"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        ¿Ya verificaste tu correo?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-700 transition hover:underline"
        >
          Ir a iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}