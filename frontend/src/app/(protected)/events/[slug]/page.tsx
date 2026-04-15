"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Lock, ArrowLeft, Clock, User, Tag } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventStatus } from "@/types/events";

const statusStyles: Record<EventStatus, { bg: string; text: string; label: string }> = {
  Open: { bg: "bg-green-100", text: "text-green-700", label: "Activo" },
  Draft: { bg: "bg-slate-100", text: "text-slate-700", label: "Borrador" },
  Published: { bg: "bg-blue-100", text: "text-blue-700", label: "Publicado" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelado" },
  Closed: { bg: "bg-slate-100", text: "text-slate-600", label: "Cerrado" },
};

const categoryColors: Record<string, string> = {
  Música: "bg-purple-100 text-purple-700",
  Tecnología: "bg-blue-100 text-blue-700",
  Cultura: "bg-green-100 text-green-700",
  Deportivo: "bg-amber-100 text-amber-700",
  Social: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<EventViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<EventViewModel>(`/api/events/slug/${slug}`);
        setEvent(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error("Error al cargar el evento");
        }
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug, router]);

  const handleJoin = async () => {
    if (!event) return;
    setJoining(true);
    try {
      await apiFetch(`/api/events/${event.id}/join`, { method: "POST" });
      toast.success("Te has unido al evento correctamente");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo unir al evento");
      }
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!event) return;
    if (!confirm("¿Estás seguro de que quieres abandonar este evento?")) return;
    
    setLeaving(true);
    try {
      await apiFetch(`/api/events/${event.id}/leave`, { method: "POST" });
      toast.success("Has abandonado el evento");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo abandonar el evento");
      }
    } finally {
      setLeaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Evento no encontrado</p>
      </div>
    );
  }

  const style = statusStyles[event.status] || statusStyles.Closed;
  const categoryClass = categoryColors[event.eventCategoryName] || categoryColors.default;
  const isEventFull = event.isFull;
  const canJoin = event.showJoinButton && !event.isCreator && !event.isMember && event.status === "Open" && !isEventFull;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-100">
          <img
            src={event.displayImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${style.bg} ${style.text}`}>
              {style.label}
            </span>
            {event.isPrivate && (
              <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                <Lock size={14} />
                Privado
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${categoryClass}`}>
              {event.eventCategoryName}
            </span>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-slate-100 text-slate-600">
              {event.eventTypeName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            {event.title}
          </h1>

          {event.description && (
            <p className="text-slate-600 mb-6 whitespace-pre-wrap">
              {event.description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar size={20} className="text-slate-400" />
              <div>
                <p className="font-medium">{formatDate(event.startDate)}</p>
                <p className="text-sm text-slate-500">
                  {event.status === "Closed" ? "Finalizado" : "Próximo"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <Clock size={20} className="text-slate-400" />
              <div>
                <p className="font-medium">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
                <p className="text-sm text-slate-500">Duración</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <MapPin size={20} className="text-slate-400" />
              <div>
                <p className="font-medium">{event.cityName}</p>
                {event.locationDetail && (
                  <p className="text-sm text-slate-500">{event.locationDetail}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <User size={20} className="text-slate-400" />
              <div>
                <p className="font-medium">{event.creatorName}</p>
                <p className="text-sm text-slate-500">Organizador</p>
              </div>
            </div>
          </div>

          {event.maxCapacity > 0 && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl">
              <Users size={20} className="text-slate-400" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">
                    Capacidad
                  </span>
                  <span className={`text-sm font-medium ${isEventFull ? "text-red-600" : "text-slate-600"}`}>
                    {event.currentCapacity}/{event.maxCapacity}
                    {isEventFull && " (Lleno)"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isEventFull ? "bg-red-500" : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min((event.currentCapacity / event.maxCapacity) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {event.isPrivate && event.accessCode && (
            <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <Lock size={18} />
                <span className="font-medium">Evento privado</span>
              </div>
              <p className="text-sm text-amber-700">
                Código de acceso: <span className="font-mono font-bold">{event.accessCode}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            {canJoin && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {joining ? "Uniéndose..." : "Unirse al evento"}
              </button>
            )}

            {event.isMember && !event.isCreator && (
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {leaving ? "Abandonando..." : "Abandonar evento"}
              </button>
            )}

            {event.isCreator && (
              <div className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-medium text-center">
                Eres el organizador
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
