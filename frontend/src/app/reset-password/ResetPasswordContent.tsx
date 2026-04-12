"use client";
export const dynamic = "force-dynamic";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import AuthShell from "@/components/AuthShell";
import AlertMessage from "@/components/AlertMessage";
import { apiFetch, ApiError } from "@/lib/api";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth";

type FormErrors = {
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams]
  );

  const [form, setForm] = useState({
    email: initialEmail,
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const passwordHelpText =
    "Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.code.trim()) {
      newErrors.code = "Debes ingresar el código de verificación.";
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = "La nueva contraseña es obligatoria.";
    } else if (!passwordRegex.test(form.newPassword)) {
      newErrors.newPassword = passwordHelpText;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Debes confirmar la contraseña.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    const payload: ResetPasswordRequest = {
      email: form.email,
      code: form.code,
      newPassword: form.newPassword,
    };

    try {
      setLoading(true);

      const response = await apiFetch<ResetPasswordResponse>(
        "/api/Users/reset-password",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (response?.success === false) {
        setErrors({
          general: response.message || "No se pudo actualizar la contraseña.",
        });
        return;
      }

      setSuccess("La contraseña se cambió exitosamente.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({
          general: err.message || "No se pudo restablecer la contraseña.",
        });
        return;
      }

      setErrors({
        general: "Ocurrió un error inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Restablecer contraseña"
      description="Ingresa el código recibido y tu nueva contraseña."
      sideTitle="Actualiza tu acceso"
      sideText="Por seguridad, valida el código enviado a tu correo y crea una nueva contraseña fuerte."
      sideFooter="Usa una contraseña segura para proteger tu cuenta."
      accent="blue"
    >
      {errors.general && (
        <AlertMessage type="error" message={errors.general} />
      )}
      {success && <AlertMessage type="success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="email" value={form.email} readOnly />

        <div>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Código de verificación"
            className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:ring-4 ${
              errors.code
                ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                : "border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
            }`}
          />
          {errors.code && (
            <p className="mt-2 text-xs text-red-600">{errors.code}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Nueva contraseña"
              className={`w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition focus:ring-4 [appearance:textfield] ${
                errors.newPassword
                  ? "border border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                  : "border border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              className={`w-full rounded-xl px-4 py-3.5 pr-12 text-sm outline-none transition focus:ring-4 [appearance:textfield] ${
                errors.confirmPassword
                  ? "border border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
                  : "border border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmación de contraseña"
                  : "Mostrar confirmación de contraseña"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div
          className={`rounded-xl border px-4 py-3 text-xs ${
            errors.newPassword
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-blue-100 bg-blue-50 text-slate-600"
          }`}
        >
          {errors.newPassword || passwordHelpText}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:from-slate-700 hover:via-blue-800 hover:to-slate-800 disabled:opacity-70"
        >
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </button>

        <p className="text-center text-sm text-slate-500">
          <Link
            href="/login"
            className="font-medium text-blue-700 hover:text-blue-900"
          >
            Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}