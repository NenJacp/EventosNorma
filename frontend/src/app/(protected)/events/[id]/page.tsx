"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Calendar, MapPin, Users, Lock, ArrowLeft } from "lucide-react";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import type { EventViewModel } from "@/types/events";

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

        {event.imageUrl && (
          <div className="w-full h-64 mb-6 rounded-xl overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 mb-2">
                {event.eventCategoryName}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
            </div>
            {event.isPrivate && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Lock size={14} />
                Privado
              </span>
            )}
          </div>

          <p className="text-slate-600 mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Fecha inicio</p>
                <p>{formatDate(event.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Fecha fin</p>
                <p>{formatDate(event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Ubicación</p>
                <p>{event.cityName}{event.locationDetail && ` - ${event.locationDetail}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users size={18} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Capacidad</p>
                <p>{event.currentCapacity} / {event.maxCapacity} ({event.availableSlots} disponibles)</p>
              </div>
            </div>
          </div>

          {event.accessCode && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-xs text-slate-500">Código de acceso</p>
              <p className="font-mono font-bold text-lg">{event.accessCode}</p>
            </div>
          )}

          {!event.isCreator && !event.isMember && !event.isFull && (
            <div className="mt-4">
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {joining ? "Uniéndose..." : "Unirse al evento"}
              </button>
            </div>
          )}

          {!event.isCreator && !event.isMember && event.isFull && (
            <div className="mt-4">
              <button
                disabled
                className="w-full bg-slate-200 text-slate-500 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Evento lleno
              </button>
            </div>
          )}

          {!event.isCreator && event.isMember && (
            <div className="mt-4">
              <div className="w-full bg-green-100 text-green-700 py-3 rounded-lg font-semibold text-center">
                Ya estás inscrito en este evento
              </div>
            </div>
          )}
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
