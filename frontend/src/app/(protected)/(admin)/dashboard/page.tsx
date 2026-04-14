"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Stats {
  totalEvents: number;
  activeEvents: number;
  totalUsers: number;
  totalSubscriptions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, users] = await Promise.all([
          apiFetch<{ totalCount: number }>("/api/events?PageSize=1"),
          apiFetch<{ totalCount: number }>("/api/Users"),
        ]);
        
        setStats({
          totalEvents: events.totalCount || 0,
          activeEvents: events.totalCount || 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalSubscriptions: 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Eventos", value: stats?.totalEvents || 0, icon: Calendar, color: "blue" },
    { title: "Eventos Activos", value: stats?.activeEvents || 0, icon: TrendingUp, color: "green" },
    { title: "Total Usuarios", value: stats?.totalUsers || 0, icon: Users, color: "purple" },
    { title: "Subscripciones", value: stats?.totalSubscriptions || 0, icon: AlertCircle, color: "amber" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumen de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            purple: "bg-purple-50 text-purple-600",
            amber: "bg-amber-50 text-amber-600",
          };
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <a href="/usuarios" className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-900">Gestionar Usuarios</p>
              <p className="text-sm text-slate-500">Ver, banear o desbanear usuarios</p>
            </a>
            <a href="/all-events" className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-900">Ver Todos los Eventos</p>
              <p className="text-sm text-slate-500">Incluye privados, cancelados y cerrados</p>
            </a>
            <a href="/catalog/countries" className="block p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <p className="font-medium text-slate-900">Catálogos</p>
              <p className="text-sm text-slate-500">Administrar países, estados, ciudades</p>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Bienvenido Admin</h2>
          <p className="text-slate-600">
            Desde este panel puedes administrar todos los aspectos de la plataforma,
            incluyendo usuarios, eventos y catálogos.
          </p>
        </div>
      </div>
    </div>
  );
}
