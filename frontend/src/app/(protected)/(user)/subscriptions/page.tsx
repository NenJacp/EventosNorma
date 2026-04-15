"use client";

import { useEffect, useState } from "react";
import { Users, LogOut, Calendar, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { toast } from "@/lib/toast";
import type { SubscriptionViewModel } from "@/types/events";

interface ApiSubscriptionResponse {
  EventId: number;
  Title: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  LocationDetail: string;
  CityName: string;
  CategoryName: string;
  TypeName: string;
  CreatorName: string;
  Status: string;
  JoinedAt: string;
  IsActive: boolean;
  MaxCapacity: number;
  CurrentCapacity: number;
  HasExited: boolean;
}

function mapApiToSubscription(apiItem: ApiSubscriptionResponse): SubscriptionViewModel {
  const isFull = apiItem.MaxCapacity > 0 && apiItem.CurrentCapacity >= apiItem.MaxCapacity;
  return {
    eventId: apiItem.EventId,
    title: apiItem.Title,
    description: apiItem.Description,
    startDate: apiItem.StartDate,
    endDate: apiItem.EndDate,
    locationDetail: apiItem.LocationDetail,
    cityName: apiItem.CityName,
    categoryName: apiItem.CategoryName,
    typeName: apiItem.TypeName,
    creatorName: apiItem.CreatorName,
    status: apiItem.Status as SubscriptionViewModel["status"],
    joinedAt: apiItem.JoinedAt,
    isActive: apiItem.IsActive,
    maxCapacity: apiItem.MaxCapacity,
    currentCapacity: apiItem.CurrentCapacity,
    hasExited: apiItem.HasExited,
    isFull,
    availableSlots: apiItem.MaxCapacity - apiItem.CurrentCapacity,
  };
}

const categoryBg: Record<string, string> = {
  Música: "bg-blue-100 text-blue-700",
  Tecnología: "bg-purple-100 text-purple-700",
  Cultura: "bg-green-100 text-green-700",
  Deportivo: "bg-amber-100 text-amber-700",
  Social: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

export default function SubscriptionsPage() {
  const [events, setEvents] = useState<SubscriptionViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMySubscriptions = async (page: number) => {
    setLoading(true);
    try {
      const data = await apiFetch<{ items: ApiSubscriptionResponse[]; totalCount: number; totalPages: number }>(
        `/api/events/me/joined?PageNumber=${page}&PageSize=12`
      );
      setEvents((data.items || []).map(mapApiToSubscription));
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

  const activeEvents = events.filter(e => e.status !== "Cancelled");
  const cancelledEvents = events.filter(e => e.status === "Cancelled");

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
          {activeEvents.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-slate-700 mb-4">Eventos activos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {activeEvents.map((event) => {
                  const bgClass = categoryBg[event.categoryName] || categoryBg.default;
                  
                  return (
                    <div key={event.eventId} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                      <Link href={`/events/${event.eventId}`}>
                        <div className="w-full h-36 overflow-hidden bg-slate-100">
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-4xl font-bold text-blue-300">{event.title[0]?.toUpperCase()}</span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${bgClass}`}>
                            {event.categoryName}
                          </span>
                          <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                            {event.typeName}
                          </span>
                        </div>
                        
                        <Link href={`/events/${event.eventId}`} className="block">
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
                          onClick={() => handleLeave(event.eventId)}
                          disabled={leavingId === event.eventId}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <LogOut size={14} />
                          {leavingId === event.eventId ? "Abandonando..." : "Abandonar evento"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {cancelledEvents.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <XCircle size={20} />
                Eventos cancelados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cancelledEvents.map((event) => {
                  const bgClass = categoryBg[event.categoryName] || categoryBg.default;
                  
                  return (
                    <div key={event.eventId} className="bg-white rounded-xl border border-red-200 overflow-hidden opacity-75">
                      <Link href={`/events/${event.eventId}`}>
                        <div className="w-full h-36 overflow-hidden bg-slate-100 grayscale">
                          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                            <span className="text-4xl font-bold text-red-300">{event.title[0]?.toUpperCase()}</span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${bgClass}`}>
                            {event.categoryName}
                          </span>
                          <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                            Cancelado
                          </span>
                        </div>
                        
                        <Link href={`/events/${event.eventId}`} className="block">
                          <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                          <MapPin size={12} />
                          <span className="truncate">
                            {event.cityName}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleLeave(event.eventId)}
                          disabled={leavingId === event.eventId}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <LogOut size={14} />
                          {leavingId === event.eventId ? "Abandonando..." : "Retirar de mi lista"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

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
