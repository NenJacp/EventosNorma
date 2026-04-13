"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import AuthShell from "@/components/AuthShell";
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
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (touched.email && form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(form.email) ? "" : "Correo electrónico inválido");
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

    const allPassed = passwordRequirements.every((req) => req.test(form.password));
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

  const allRequirementsMet = passwordRequirements.every((req) => req.test(form.password));

  return (
    <AuthShell
      title="Crear cuenta"
      description="Completa los siguientes datos para registrarte"
      sideTitle="Crea tu cuenta y empieza a gestionar eventos fácilmente."
      sideText="Registra tus datos para comenzar con la configuración de tu app."
      sideFooter="Después del registro te llevaremos a validar tu correo."
      accent="blue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Tu apellido"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="ejemplo@correo.com"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <X size={14} /> {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Crea una contraseña segura"
          />
          {touched.password && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, i) => (
                <p
                  key={i}
                  className={`text-xs flex items-center gap-1 ${
                    req.test(form.password) ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {req.test(form.password) ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} />
                  )}
                  {req.label}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !allRequirementsMet}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-700 transition hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}