"use client";

import Link from "next/link";
import {
  Tags,
  Shapes,
  Globe,
  MapPinned,
  Building2,
  Search,
  ArrowRight,
  Plus,
  FolderKanban,
} from "lucide-react";

const catalogs = [
  {
    title: "Categorías de eventos",
    description:
      "Organiza los eventos por grupos principales para una mejor clasificación.",
    href: "/admin/catalogs/event-categories",
    createHref: "/admin/catalogs/event-categories/create",
    icon: Tags,
    badge: "Catálogo base",
  },
  {
    title: "Tipos de eventos",
    description:
      "Define los distintos tipos de eventos disponibles en la plataforma.",
    href: "/admin/catalogs/event-types",
    createHref: "/admin/catalogs/event-types/create",
    icon: Shapes,
    badge: "Catálogo base",
  },
  {
    title: "Países",
    description:
      "Administra los países disponibles para las ubicaciones y registros.",
    href: "/admin/catalogs/countries",
    createHref: "/admin/catalogs/countries/create",
    icon: Globe,
    badge: "Ubicación",
  },
  {
    title: "Estados",
    description:
      "Gestiona los estados o regiones asociados a cada país.",
    href: "/admin/catalogs/states",
    createHref: "/admin/catalogs/states/create",
    icon: MapPinned,
    badge: "Ubicación",
  },
  {
    title: "Ciudades",
    description:
      "Controla las ciudades registradas para cada estado.",
    href: "/admin/catalogs/cities",
    createHref: "/admin/catalogs/cities/create",
    icon: Building2,
    badge: "Ubicación",
  },
];

export default function AdminCatalogsPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                <FolderKanban size={16} />
                Gestión de catálogos
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Administración de catálogos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
                Desde aquí puedes crear, consultar y administrar los catálogos
                principales del sistema. Esta sección será la base para la
                configuración general de la plataforma.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/home"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Volver al panel
              </Link>

              <Link
                href="/admin/catalogs/event-categories/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Plus size={18} />
                Crear catálogo
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar un catálogo..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalogs.map((catalog) => {
            const Icon = catalog.icon;

            return (
              <div
                key={catalog.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-3 text-white shadow-md">
                    <Icon size={22} />
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {catalog.badge}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {catalog.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {catalog.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={catalog.href}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
                  >
                    Administrar
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href={catalog.createHref}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <Plus size={16} />
                    Crear
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Orden recomendado de configuración
            </h3>

            <div className="mt-5 space-y-3">
              {[
                "1. Registrar países",
                "2. Registrar estados",
                "3. Registrar ciudades",
                "4. Crear categorías de eventos",
                "5. Crear tipos de eventos",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Resumen de esta sección
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Catálogos visibles</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Módulos iniciales</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Base</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Prioridad</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">Alta</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Estado</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  En desarrollo
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}