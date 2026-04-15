"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Lock, XCircle, Search, X, Ban, Trash2 } from "lucide-react";
import Pagination from "@/components/Pagination";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  cityName: string;
  creatorName: string;
  currentCapacity: number;
  maxCapacity: number;
  isActive: boolean;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  Open: { bg: "bg-green-100", text: "text-green-700", label: "Activo" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelado" },
  Closed: { bg: "bg-slate-100", text: "text-slate-700", label: "Cerrado" },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [cancellingEvent, setCancellingEvent] = useState<EventItem | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchEvents = async (page: number) => {
    setLoading(true);
    try {
      let url = `/api/events?PageNumber=${page}&PageSize=12`;
      if (searchQuery) {
        url += `&Title=${encodeURIComponent(searchQuery)}`;
      }
      const data = await apiFetch<{
        items: EventItem[];
        totalCount: number;
        totalPages: number;
      }>(url);
      setEvents(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchEvents(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(1);
  };

  const filteredEvents = statusFilter
    ? events.filter(e => e.status === statusFilter)
    : events;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setProcessing(true);
    try {
      await apiFetch(`/api/events/${deletingEvent.id}`, { method: "DELETE" });
      toast.success("Evento eliminado correctamente");
      setDeletingEvent(null);
      fetchEvents(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo eliminar el evento");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellingEvent) return;
    setProcessing(true);
    try {
      await apiFetch(`/api/events/${cancellingEvent.id}/cancel`, { method: "POST" });
      toast.success("Evento cancelado correctamente");
      setCancellingEvent(null);
      fetchEvents(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo cancelar el evento");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eventos</h1>
          <p className="text-sm text-slate-500">Todos los eventos de la plataforma</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="Open">Activos</option>
            <option value="Cancelled">Cancelados</option>
            <option value="Closed">Cerrados</option>
          </select>
        </div>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">
        {totalCount} evento{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
      </span>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No hay eventos registrados</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Evento</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estatus</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacidad</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Creador</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event) => {
                    const style = statusStyles[event.status] || statusStyles.Closed;
                    return (
                      <tr key={event.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <Link href={`/admin/events/${event.id}`} className="block">
                            <p className="text-sm font-medium text-slate-900 hover:text-blue-600">
                              {event.title}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin size={12} />
                              {event.cityName}
                              {event.isPrivate && (
                                <span className="inline-flex items-center gap-1 ml-2 text-amber-600">
                                  <Lock size={10} /> Privado
                                </span>
                              )}
                            </p>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${event.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {event.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">{formatDate(event.startDate)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {event.currentCapacity}/{event.maxCapacity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">{event.creatorName}</p>
                        </td>
                        <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                            {event.status !== "Cancelled" && (
                              <button
                                onClick={() => setCancellingEvent(event)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancelar evento"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeletingEvent(event)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Eliminar evento"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {deletingEvent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setDeletingEvent(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Trash2 className="text-red-500" size={20} />
                  Eliminar Evento
                </h2>
                <button onClick={() => setDeletingEvent(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-2">
                  ¿Estás seguro de que quieres eliminar el evento <strong>"{deletingEvent.title}"</strong>?
                </p>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
                <button onClick={() => setDeletingEvent(null)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleDelete} disabled={processing} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                  {processing ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {cancellingEvent && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setCancellingEvent(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <XCircle className="text-red-500" size={20} />
                  Cancelar Evento
                </h2>
                <button onClick={() => setCancellingEvent(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-slate-600">
                  ¿Estás seguro de que quieres cancelar el evento <strong>"{cancellingEvent.title}"</strong>?
                </p>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
                <button onClick={() => setCancellingEvent(null)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleCancel} disabled={processing} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                  {processing ? "Cancelando..." : "Cancelar Evento"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
