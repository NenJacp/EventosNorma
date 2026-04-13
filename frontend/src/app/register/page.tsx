"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import AuthCardLayout from "@/components/AuthCardLayout";
import PasswordInput from "@/components/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";

const passwordRequirements = [
  { test: (p: string) => p.length >= 8, label: "Mínimo 8 caracteres" },
  { test: (p: string) => /[a-z]/.test(p), label: "Una letra minúscula" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Una letra mayúscula" },
  { test: (p: string) => /\d/.test(p), label: "Un número" },
  { test: (p: string) => /[\W_]/.test(p), label: "Un carácter especial" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (touched.email && form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(form.email) ? "" : "Correo electrónico inválido"
      );
    }
  }, [form.email, touched.email]);

  const validateForm = () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Todos los campos son obligatorios.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Ingresa un correo válido.");
      return false;
    }

    const allPassed = passwordRequirements.every((req) =>
      req.test(form.password)
    );
    if (!allPassed) {
      toast.error("La contraseña no cumple todos los requisitos.");
      return false;
    }

    if (form.password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = await apiFetch<RegisterResponse>("/api/Users/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast.success(`Usuario ${data.firstName} registrado correctamente.`);
      localStorage.setItem("pendingEmail", form.email);
      router.push("/verify-email");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(form.password)
  );

  return (
    <AuthCardLayout
      eyebrow="Registro"
      title="Crear cuenta"
      description="Completa los siguientes datos para registrarte en la plataforma."
      sideTitle={
        <>
          Crea tu <span className="text-blue-400">cuenta</span> y comienza a
          gestionar eventos
        </>
      }
      sideDescription="Registra tus datos para comenzar con la configuración de tu sistema. Después del registro, podrás validar tu correo y continuar."
      statusText="Registro disponible"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-700 transition hover:underline"
          >
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Nombre
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Tu apellido"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="ejemplo@correo.com"
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          />
          {emailError && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <X size={14} />
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Contraseña
          </label>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Crea una contraseña segura"
            disabled={loading}
          />

          {touched.password && (
            <div className="mt-3 grid gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {passwordRequirements.map((req, i) => {
                const passed = req.test(form.password);

                return (
                  <p
                    key={i}
                    className={`flex items-center gap-2 text-xs ${
                      passed ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {passed ? <Check size={14} /> : <X size={14} />}
                    {req.label}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Confirmar contraseña
          </label>
          <PasswordInput
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            disabled={loading}
          />
          {confirmPassword && (
            <p
              className={`mt-2 flex items-center gap-1 text-xs ${
                form.password === confirmPassword
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {form.password === confirmPassword ? (
                <Check size={14} />
              ) : (
                <X size={14} />
              )}
              {form.password === confirmPassword
                ? "Las contraseñas coinciden"
                : "Las contraseñas no coinciden"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !allRequirementsMet}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(21,101,255,0.24)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>
    </AuthCardLayout>
  );
}