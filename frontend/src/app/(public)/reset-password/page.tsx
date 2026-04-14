"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import AuthCardLayout from "@/components/AuthCardLayout";
import PasswordInput from "@/components/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"code" | "password">("code");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");

    if (emailFromQuery) {
      setForm((prev) => ({ ...prev, email: emailFromQuery }));
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

  const validateCode = () => {
    if (!form.email.trim()) {
      toast.error("No se encontró un correo para validar.");
      return false;
    }

    if (!form.code.trim()) {
      toast.error("El código de verificación es obligatorio.");
      return false;
    }

    if (form.code.trim().length !== 8) {
      toast.error("El código debe tener 8 dígitos.");
      return false;
    }

    return true;
  };

  const handleVerifyCode = async () => {
    if (!validateCode()) return;

    setLoading(true);

    try {
      await apiFetch("/api/Users/verify-password-code", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          code: form.code,
        }),
      });

      toast.success("Código verificado. Ahora ingresa tu nueva contraseña.");
      localStorage.setItem("resetEmail", form.email);
      setStep("password");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo verificar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (!form.newPassword.trim()) {
      toast.error("La nueva contraseña es obligatoria.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(form.newPassword)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial."
      );
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);

    try {
      await apiFetch("/api/Users/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          code: form.code,
          newPassword: form.newPassword,
        }),
      });

      toast.success("Contraseña actualizada correctamente.");
      localStorage.removeItem("resetEmail");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo restablecer la contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "password") {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const requisitos = [
      { test: passwordRegex.test(form.newPassword), label: "8+ caracteres" },
      { test: /[a-z]/.test(form.newPassword), label: "Minúscula" },
      { test: /[A-Z]/.test(form.newPassword), label: "Mayúscula" },
      { test: /\d/.test(form.newPassword), label: "Número" },
      { test: /[\W_]/.test(form.newPassword), label: "Carácter especial" },
    ];

    const ok = requisitos.every((r) => r.test);

    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            title="Correo electrónico"
            className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-gray-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Nueva contraseña
          </label>
          <PasswordInput
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Crea una contraseña segura"
            disabled={loading}
          />

          {form.newPassword && (
            <div className="mt-3 grid gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {requisitos.map((r, i) => (
                <p
                  key={i}
                  className={`flex items-center gap-2 text-xs ${
                    r.test ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {r.test ? <Check size={14} /> : <X size={14} />}
                  {r.label}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Confirmar contraseña
          </label>
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={loading || !ok}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          disabled
          title="Correo electrónico"
          placeholder="Tu correo electrónico"
          className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-gray-500 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          Código de verificación
        </label>
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Ej. 88888888"
          title="Código de verificación"
          maxLength={8}
          disabled={loading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <button
        type="button"
        onClick={handleVerifyCode}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verificando..." : "Verificar código"}
      </button>

      <p className="pt-2 text-center text-sm text-gray-500">
        ¿No recibiste el código?{" "}
        <Link
          href="/forgot-password"
          className="font-bold text-blue-700 transition hover:underline"
        >
          Solicitar otro
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<p className="p-4 text-center text-gray-500">Cargando...</p>}
    >
      <AuthCardLayout
        eyebrow="Restablecimiento"
        title="Restablecer contraseña"
        description="Ingresa el código que te enviamos y crea una nueva contraseña."
        sideTitle={
          <>
            Crea una nueva <span className="text-blue-400">contraseña</span>
          </>
        }
        sideDescription="Valida tu código de recuperación y define una contraseña segura para volver a acceder a tu cuenta."
        statusText="Recuperación segura"
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
        <ResetPasswordForm />
      </AuthCardLayout>
    </Suspense>
  );
}