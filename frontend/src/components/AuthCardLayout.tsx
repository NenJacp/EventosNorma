"use client";

import type { ReactNode } from "react";

type AuthCardLayoutProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  badgeText?: string;
  sideTitle?: ReactNode;
  sideDescription?: string;
  statusText?: string;
};

export default function AuthCardLayout({
  eyebrow = "Bienvenido",
  title,
  description,
  children,
  footer,
  badgeText = "Sistema de administración de eventos",
  sideTitle = (
    <>
      Gestiona tus <span className="text-blue-400">eventos</span> con una imagen moderna
    </>
  ),
  sideDescription = "Organiza categorías, tipos de eventos, países, estados y ciudades desde una plataforma limpia, elegante y segura.",
  statusText = "Sistema activo y disponible",
}: AuthCardLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#05070a_0%,#0d1118_55%,#101827_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-60px] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <section className="hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01)),linear-gradient(135deg,#090c12,#101827)] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="mt-10 max-w-md">
                <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-100">
                  {badgeText}
                </span>

                <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight">
                  {sideTitle}
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/70">
                  {sideDescription}
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-bold">
                      Administración centralizada
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-white/60">
                      Todo tu sistema concentrado en una sola interfaz clara y profesional.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h3 className="text-sm font-bold">Acceso seguro</h3>
                    <p className="mt-1 text-xs leading-6 text-white/60">
                      Ingreso protegido para administradores y gestores autorizados.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_12px_#22c55e]" />
              {statusText}
            </div>
          </section>

          <section className="flex items-center justify-center bg-white/95 px-5 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-sm">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  {eyebrow}
                </p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description}
                </p>
              </div>

              {children}

              {footer ? (
                <div className="mt-5 text-center text-sm text-gray-500">
                  {footer}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}