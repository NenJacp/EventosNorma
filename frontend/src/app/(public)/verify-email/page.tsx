"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCardLayout from "@/components/AuthCardLayout";
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
      toast.error("No se encontró un correo para reenviar el código.");
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
      toast.error("Debes completar el código de verificación.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("El correo guardado no es válido.");
      return false;
    }

    if (form.token.trim().length !== 8) {
      toast.error("El código debe tener 8 caracteres.");
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
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            disabled
            title="Correo electrónico"
            placeholder="ejemplo@correo.com"
            className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-gray-500 outline-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            Este correo fue tomado de tu registro o del enlace recibido.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Código de verificación
          </label>
          <input
            type="text"
            name="token"
            value={form.token}
            onChange={handleChange}
            placeholder="Ej. 88888888"
            maxLength={8}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Verificar correo"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending || !form.email.trim()}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {resending ? "Enviando..." : "Reenviar código"}
      </button>

      <p className="pt-2 text-center text-sm text-gray-500">
        ¿Ya verificaste tu correo?{" "}
        <Link
          href="/login"
          className="font-bold text-blue-700 transition hover:underline"
        >
          Ir a iniciar sesión
        </Link>
      </p>

      <p className="text-center text-sm text-gray-500">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-bold text-blue-700 transition hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<p className="p-4 text-center text-gray-500">Cargando...</p>}
    >
      <AuthCardLayout
        eyebrow="Verificación"
        title="Verificar correo"
        description="Ingresa el código de autenticación para activar tu cuenta."
        sideTitle={
          <>
            Verifica tu <span className="text-blue-400">correo</span> para
            activar tu cuenta
          </>
        }
        sideDescription="Completa este paso para validar tu identidad y poder iniciar sesión normalmente en la plataforma."
        statusText="Verificación disponible"

      >
        <VerifyEmailForm />
      </AuthCardLayout>
    </Suspense>
  );
}