"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";
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
      toast.error("El correo electrónico es obligatorio.");
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
        body: JSON.stringify({ email: form.email, code: form.code }),
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(form.newPassword)) {
      toast.error("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
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
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <PasswordInput
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Crea una contraseña segura"
          />
          {form.newPassword && (
            <div className="mt-2 space-y-1">
              {requisitos.map((r, i) => (
                <p key={i} className={`text-xs flex items-center gap-1 ${r.test ? "text-green-600" : "text-red-500"}`}>
                  {r.test ? "✓" : "✗"} {r.label}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
          />
        </div>

        <button
          onClick={handleChangePassword}
          disabled={loading || !ok}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Ej. 88888888"
          maxLength={8}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <button
        onClick={handleVerifyCode}
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verificando..." : "Verificar código"}
      </button>

      <p className="mt-6 text-sm text-gray-600 text-center">
        ¿No recibiste el código?{" "}
        <Link href="/forgot-password" className="font-semibold text-blue-700 hover:underline">
          Solicitar otro
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="p-4 text-center text-gray-500">Cargando...</p>}>
      <AuthShell
        title="Restablecer contraseña"
        description="Ingresa el código que te enviamos"
        sideTitle="Crea una nueva contraseña"
        sideText="Ingresa el código de verificación y luego tu nueva contraseña."
        sideFooter="Asegúrate de recordar esta contraseña."
        accent="blue"
      >
        <ResetPasswordForm />
      </AuthShell>
    </Suspense>
  );
}