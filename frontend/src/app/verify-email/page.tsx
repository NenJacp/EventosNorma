"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    token: "",
  });

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
      localStorage.setItem("pendingEmail", emailFromQuery);
    } else {
      const saved = localStorage.getItem("pendingEmail");
      if (saved) {
        setForm((prev) => ({ ...prev, email: saved }));
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResend = async () => {
    if (!form.email.trim()) {
      toast.error("Ingresa tu correo electrónico.");
      return;
    }

    setResending(true);
    try {
      await apiFetch("/api/Users/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: form.email }),
      });
      toast.success("Código reenviado correctamente.");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo reenviar el código.");
      }
    } finally {
      setResending(false);
    }
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.token.trim()) {
      toast.error("Debes completar el correo y el código de verificación.");
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

      await apiFetch("/api/Users/verify-email", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success("Correo verificado correctamente.");
      localStorage.removeItem("pendingEmail");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo verificar el correo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            Código de verificación
          </label>
          <input
            type="text"
            name="token"
            value={form.token}
            onChange={handleChange}
            placeholder="Ej. 88888888"
            maxLength={8}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Verificar correo"}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={resending || !form.email.trim()}
        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {resending ? "Enviando..." : "Reenviar código"}
      </button>

      <p className="mt-6 text-sm text-gray-600 text-center">
        ¿Ya verificaste tu correo?{" "}
        <Link href="/login" className="font-semibold text-blue-700 hover:underline">
          Ir a iniciar sesión
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        {" ¿No tienes cuenta? "}
        <Link href="/register" className="font-semibold text-blue-700 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="p-4 text-center text-gray-500">Cargando...</p>}>
      <AuthShell
        title="Verificar correo"
        description="Escribe tu correo y el código de autenticación"
        sideTitle="Verifica tu correo para activar tu cuenta."
        sideText="Ingresa el código que te fue enviado por correo electrónico para completar el acceso al sistema."
        sideFooter="Después de verificar tu cuenta podrás iniciar sesión normalmente."
        accent="blue"
      >
        <VerifyEmailForm />
      </AuthShell>
    </Suspense>
  );
}