"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Shapes,
  Globe,
  MapPinned,
  Building2,
  Users,
  CalendarDays,
  Settings,
  ArrowRight,
  Plus,
} from "lucide-react";

const catalogs = [
  {
    title: "Categorías de eventos",
    description:
      "Administra las categorías principales que organizan los eventos.",
    href: "/admin/catalogs/event-categories",
    icon: Tags,
    count: "--",
  },
  {
    title: "Tipos de eventos",
    description:
      "Configura los distintos tipos de eventos disponibles en la plataforma.",
    href: "/admin/catalogs/event-types",
    icon: Shapes,
    count: "--",
  },
  {
    title: "Países",
    description:
      "Gestiona los países que estarán disponibles para la ubicación de eventos.",
    href: "/admin/catalogs/countries",
    icon: Globe,
    count: "--",
  },
  {
    title: "Estados",
    description:
      "Administra los estados o regiones asociados a cada país.",
    href: "/admin/catalogs/states",
    icon: MapPinned,
    count: "--",
  },
  {
    title: "Ciudades",
    description:
      "Controla las ciudades disponibles dentro de cada estado o región.",
    href: "/admin/catalogs/cities",
    icon: Building2,
    count: "--",
  },
];

const quickStats = [
  {
    title: "Catálogos activos",
    value: "5",
    icon: FolderKanban,
  },
  {
    title: "Usuarios registrados",
    value: "--",
    icon: Users,
  },
  {
    title: "Eventos creados",
    value: "--",
    icon: CalendarDays,
  },
];

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-6 text-white lg:flex">
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <LayoutDashboard size={22} />
                <div>
                  <p className="text-sm text-slate-200">Panel</p>
                  <h2 className="text-lg font-semibold">Admin Eventos</h2>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                href="/admin/home"
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                href="/admin/catalogs"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <FolderKanban size={18} />
                Catálogos
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Users size={18} />
                Usuarios
              </Link>

              <Link
                href="/admin/events"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <CalendarDays size={18} />
                Eventos
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Settings size={18} />
                Configuración
              </Link>
            </nav>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-slate-200">
              Desde aquí puedes administrar catálogos, usuarios y configuraciones
              principales del sistema.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm text-slate-200">Administrador</p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Panel de gestión
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Administra los catálogos principales del sistema y mantén
                  organizada la estructura de eventos, ubicaciones y configuraciones.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/catalogs/event-categories/create"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <Plus size={18} />
                  Nueva categoría
                </Link>

                <Link
                  href="/admin/catalogs"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Ver catálogos
                  <ArrowRight size={18} />
                </Link>
              </div>
            </header>

            <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                        <Icon size={22} />
                      </div>
                    </div>

                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h3>
                  </div>
                );
              })}
            </section>

            <section className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Gestión de catálogos
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Selecciona un módulo para crear, editar o consultar información.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {catalogs.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="mb-5 flex items-start justify-between">
                        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-3 text-white shadow-md">
                          <Icon size={22} />
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {item.count}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                      <div className="mt-6 flex gap-3">
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
                        >
                          Administrar
                        </Link>

                        <Link
                          href={`${item.href}/create`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          Crear
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Flujo recomendado
                </h3>
                <div className="mt-5 space-y-4">
                  {[
                    "1. Registra países",
                    "2. Registra estados por país",
                    "3. Registra ciudades por estado",
                    "4. Crea categorías de eventos",
                    "5. Define tipos de eventos",
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Accesos rápidos
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/admin/catalogs/countries/create"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Crear país
                  </Link>

                  <Link
                    href="/admin/catalogs/states/create"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Crear estado
                  </Link>

                  <Link
                    href="/admin/catalogs/cities/create"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Crear ciudad
                  </Link>

                  <Link
                    href="/admin/catalogs/event-types/create"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Crear tipo de evento
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
  
}
