"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, Globe, Tag, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  cancelledEvents: number;
  totalUsers: number;
  totalCountries: number;
  totalCities: number;
}

interface RecentEvent {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  creatorName: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, countriesRes, citiesRes] = await Promise.all([
          apiFetch<{ items: any[]; totalCount: number }>("/api/events?PageNumber=1&PageSize=100&IsActive=true"),
          apiFetch<any[]>("/api/countries"),
          apiFetch<any[]>("/api/cities"),
        ]);

        const allEvents = eventsRes.items || [];
        const activeEvents = allEvents.filter((e: any) => e.status === "Open").length;
        const cancelledEvents = allEvents.filter((e: any) => e.status === "Cancelled").length;

        setStats({
          totalEvents: eventsRes.totalCount || 0,
          activeEvents,
          cancelledEvents,
          totalUsers: 0,
          totalCountries: (countriesRes || []).length,
          totalCities: (citiesRes || []).length,
        });

        setRecentEvents(allEvents.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumen de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats?.totalEvents || 0}</p>
              <p className="text-sm text-slate-500">Eventos totales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats?.activeEvents || 0}</p>
              <p className="text-sm text-slate-500">Eventos activos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-slate-500">Usuarios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Globe size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats?.totalCities || 0}</p>
              <p className="text-sm text-slate-500">Ciudades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Eventos recientes</h2>
            <Link href="/admin/events" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentEvents.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No hay eventos registrados
              </div>
            ) : (
              recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.creatorName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : event.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {event.status === "Open" ? "Activo" : event.status === "Cancelled" ? "Cancelado" : event.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Acciones rápidas</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link
              href="/admin/catalog/countries"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Globe size={20} className="text-slate-500" />
              <span className="text-sm font-medium">Gestionar Países</span>
            </Link>
            <Link
              href="/admin/catalog/cities"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Tag size={20} className="text-slate-500" />
              <span className="text-sm font-medium">Gestionar Ciudades</span>
            </Link>
            <Link
              href="/admin/catalog/event-types"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Clock size={20} className="text-slate-500" />
              <span className="text-sm font-medium">Tipos de Evento</span>
            </Link>
            <Link
              href="/admin/catalog/event-categories"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Tag size={20} className="text-slate-500" />
              <span className="text-sm font-medium">Categorías</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
