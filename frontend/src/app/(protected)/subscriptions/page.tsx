"use client";

import { useEffect, useState } from "react";
import { Users, LogOut, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventsResponse } from "@/types/events";

const categoryBg: Record<string, string> = {
  Música: "bg-blue-100 text-blue-700",
  Tecnología: "bg-purple-100 text-purple-700",
  Cultura: "bg-green-100 text-green-700",
  Deportivo: "bg-amber-100 text-amber-700",
  Social: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

export default function SubscriptionsPage() {
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMySubscriptions = async (page: number) => {
    setLoading(true);
    try {
      const data = await apiFetch<EventsResponse>(
        `/api/events/me/joined?PageNumber=${page}&PageSize=12`
      );
      setEvents(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar tus subscripciones");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubscriptions(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchMySubscriptions(page);
  };

  const handleLeave = async (eventId: number) => {
    if (!confirm("¿Estás seguro de que quieres abandonar este evento?")) return;
    
    setLeavingId(eventId);
    try {
      await apiFetch(`/api/events/${eventId}/leave`, { method: "POST" });
      toast.success("Has abandonado el evento correctamente");
      fetchMySubscriptions(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo abandonar el evento");
      }
    } finally {
      setLeavingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Subscripciones</h1>
          <p className="text-sm text-slate-500">
            Eventos a los que te has unido
          </p>
        </div>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">
        {totalCount} evento{totalCount !== 1 ? "s" : ""} asistido{totalCount !== 1 ? "s" : ""}
      </span>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-2">No te has unido a ningún evento aún</p>
          <p className="text-sm text-slate-400">
            Explora eventos disponibles y únete a ellos
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => {
              const bgClass = categoryBg[event.eventCategoryName] || categoryBg.default;
              const imageToShow = event.displayImageUrl || event.imageUrl;
              
              return (
                <div key={event.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/events/${event.slug}`}>
                    <div className="w-full h-36 overflow-hidden bg-slate-100">
                      <img
                        src={imageToShow || "/uploads/events/defaultprofile.png"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${bgClass}`}>
                        {event.eventCategoryName}
                      </span>
                      <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {event.eventTypeName}
                      </span>
                      {event.isPrivate && (
                        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          Privado
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/events/${event.slug}`} className="block">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                      <MapPin size={12} />
                      <span className="truncate">
                        {event.cityName}
                        {event.locationDetail && ` · ${event.locationDetail}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mb-3">
                      <span className="text-[11px] text-slate-400">
                        <Calendar size={12} className="inline mr-1" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className={`text-[11px] font-medium ${event.isFull ? "text-red-500" : "text-slate-500"}`}>
                        <Users size={12} className="inline mr-1" />
                        {event.isFull ? "Lleno" : `${event.availableSlots} disponibles`}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleLeave(event.id)}
                      disabled={leavingId === event.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <LogOut size={14} />
                      {leavingId === event.id ? "Abandonando..." : "Abandonar evento"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}