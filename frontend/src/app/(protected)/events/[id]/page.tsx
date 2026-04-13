"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Calendar, MapPin, Users, Lock, ArrowLeft, Tag } from "lucide-react";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import type { EventViewModel } from "@/types/events";

const categoryColors: Record<string, string> = {
  Música: "from-blue-500 to-blue-600",
  Tecnología: "from-purple-500 to-purple-600",
  Cultura: "from-green-500 to-green-600",
  Deportivo: "from-amber-500 to-amber-600",
  Social: "from-pink-500 to-pink-600",
  default: "from-slate-500 to-slate-600",
};

const categoryBg: Record<string, string> = {
  Música: "bg-blue-100 text-blue-700",
  Tecnología: "bg-purple-100 text-purple-700",
  Cultura: "bg-green-100 text-green-700",
  Deportivo: "bg-amber-100 text-amber-700",
  Social: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

const categoryEmoji: Record<string, string> = {
  Música: "🎵",
  Tecnología: "💻",
  Cultura: "🌿",
  Deportivo: "⚽",
  Social: "🎉",
  default: "📅",
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.id as string;
  const codeFromUrl = searchParams.get("code");
  const [event, setEvent] = useState<EventViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [pendingSlug, setPendingSlug] = useState("");

  const fetchEvent = async (code?: string) => {
    try {
      const url = code ? `/api/events/slug/${slug}?code=${code}` : `/api/events/slug/${slug}`;
      const data = await apiFetch<EventViewModel>(url);
      setEvent(data);
      setShowCodeModal(false);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          setPendingSlug(slug);
          setShowCodeModal(true);
        } else {
          toast.error(err.message);
          router.push("/home");
        }
      } else {
        toast.error("Error al cargar el evento");
        router.push("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchEvent(codeFromUrl || undefined);
    }
  }, [slug, codeFromUrl]);

  const handleJoin = async () => {
    if (!event) return;
    setJoining(true);
    try {
      await apiFetch(`/api/events/${event.id}/join`, { method: "POST" });
      toast.success("Te has unido al evento correctamente");
      fetchEvent();
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

  const handleCodeModalSuccess = (eventData: EventViewModel) => {
    setEvent(eventData);
    setShowCodeModal(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const colorClass = categoryColors[event.eventCategoryName] || categoryColors.default;
  const bgClass = categoryBg[event.eventCategoryName] || categoryBg.default;
  const emoji = categoryEmoji[event.eventCategoryName] || categoryEmoji.default;

  return (
    <>
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {event.imageUrl ? (
            <div className="w-full h-56 md:h-72 overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-full h-40 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <span className="text-6xl">{emoji}</span>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${bgClass}`}>
                    {event.eventCategoryName}
                  </span>
                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {event.eventTypeName}
                  </span>
                  {event.isPrivate && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      <Lock size={12} />
                      Privado
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
              </div>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Fecha y hora</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(event.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ubicación</p>
                  <p className="text-sm font-medium text-slate-900">
                    {event.cityName}
                    {event.locationDetail && ` - ${event.locationDetail}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Users size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Capacidad</p>
                  <p className="text-sm font-medium text-slate-900">
                    {event.currentCapacity} / {event.maxCapacity} personas
                  </p>
                  {event.availableSlots > 0 && (
                    <p className="text-xs text-green-600">{event.availableSlots} lugares disponibles</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Tag size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Tipo de evento</p>
                  <p className="text-sm font-medium text-slate-900">{event.eventTypeName}</p>
                </div>
              </div>
            </div>

            {event.accessCode && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={16} className="text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">Código de acceso</p>
                </div>
                <p className="font-mono font-bold text-2xl text-amber-900 tracking-widest">{event.accessCode}</p>
                <p className="text-xs text-amber-600 mt-1">Compártelo con quienes quieras invitar</p>
              </div>
            )}

            {!event.isCreator && !event.isMember && !event.isFull && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {joining ? "Uniéndose..." : "Unirse al evento"}
              </button>
            )}

            {!event.isCreator && !event.isMember && event.isFull && (
              <div className="w-full bg-slate-200 text-slate-500 py-4 rounded-xl font-semibold text-center">
                Evento lleno
              </div>
            )}

            {!event.isCreator && event.isMember && (
              <div className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-semibold text-center">
                Ya estás inscrito en este evento
              </div>
            )}
          </div>
        </div>
      </div>

      <JoinByCodeModal
        isOpen={showCodeModal}
        onClose={() => {
          setShowCodeModal(false);
          router.push("/home");
        }}
        slug={pendingSlug}
        onSuccess={handleCodeModalSuccess}
      />
    </>
  );
}
