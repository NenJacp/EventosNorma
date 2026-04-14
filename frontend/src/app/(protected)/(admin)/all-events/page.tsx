"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Lock, Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { apiFetch } from "@/lib/api";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  status: string;
  isPrivate: boolean;
  startDate: string;
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
  const [statusFilter, setStatusFilter] = useState("");

  const fetchEvents = async (page: number) => {
    setLoading(true);
    try {
      let url = `/api/events?PageNumber=${page}&PageSize=12`;
      if (searchQuery) url += `&Title=${encodeURIComponent(searchQuery)}`;
      const data = await apiFetch<{ items: EventItem[]; totalCount: number; totalPages: number }>(url);
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

  useEffect(() => { fetchEvents(1); }, []);

  const handlePageChange = (page: number) => fetchEvents(page);
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchEvents(1); };
  const filteredEvents = statusFilter ? events.filter(e => e.status === statusFilter) : events;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Todos los Eventos</h1>
          <p className="text-sm text-slate-500">Eventos públicos, privados, cancelados y cerrados</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" placeholder="Buscar eventos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Todos</option>
            <option value="Open">Activos</option>
            <option value="Cancelled">Cancelados</option>
            <option value="Closed">Cerrados</option>
          </select>
        </div>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">{totalCount} evento{totalCount !== 1 ? "s" : ""}</span>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No hay eventos registrados</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Evento</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Capacidad</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Creador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((event) => {
                  const style = statusStyles[event.status] || statusStyles.Closed;
                  return (
                    <tr key={event.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Link href={`/events/${event.id}`} className="block">
                          <p className="text-sm font-medium text-slate-900 hover:text-blue-600">{event.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} />{event.cityName}
                            {event.isPrivate && <span className="inline-flex items-center gap-1 ml-2 text-amber-600"><Lock size={10} /> Privado</span>}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>{style.label}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{formatDate(event.startDate)}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-2"><Users size={14} className="text-slate-400" /><span className="text-sm text-slate-700">{event.currentCapacity}/{event.maxCapacity}</span></div></td>
                      <td className="px-6 py-4 text-sm text-slate-700">{event.creatorName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /></div>
        </>
      )}
    </div>
  );
}
