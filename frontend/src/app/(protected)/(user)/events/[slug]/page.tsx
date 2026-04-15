"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Calendar, MapPin, Users, Lock, ArrowLeft, Tag, Pencil, Trash2, LogOut, XCircle, RotateCcw, UserCheck } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import CreateEventModal from "@/components/CreateEventModal";
import EventMembersModal from "@/components/EventMembersModal";
import CommentsSection from "@/components/CommentsSection";
import ConfirmationModal from "@/components/ConfirmationModal";
import type { EventViewModel } from "@/types/events";

const categoryBg: Record<string, string> = {
  Música: "bg-blue-100 text-blue-700",
  Tecnología: "bg-purple-100 text-purple-700",
  Cultura: "bg-green-100 text-green-700",
  Deportivo: "bg-amber-100 text-amber-700",
  Social: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-700",
};

const statusBg: Record<string, { bg: string; text: string }> = {
  Open: { bg: "bg-green-100", text: "text-green-700" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700" },
  Closed: { bg: "bg-slate-100", text: "text-slate-700" },
  Draft: { bg: "bg-amber-100", text: "text-amber-700" },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const codeFromUrl = searchParams.get("code");
  
  const [event, setEvent] = useState<EventViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [pendingSlug, setPendingSlug] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const fetchEvent = async (code?: string) => {
    setLoading(true);
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
  }, [slug, codeFromUrl, router]);

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

  const handleLeave = async () => {
    if (!event) return;
    
    setLeaving(true);
    try {
      await apiFetch(`/api/events/${event.id}/leave`, { method: "POST" });
      toast.success("Has abandonado el evento correctamente");
      router.push("/subscriptions");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo abandonar el evento");
      }
    } finally {
      setLeaving(false);
      setShowLeaveModal(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    
    setDeleting(true);
    try {
      await apiFetch(`/api/events/${event.id}`, { method: "DELETE" });
      toast.success("Evento eliminado correctamente");
      router.push("/my-events");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo eliminar el evento");
      }
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = async () => {
    if (!event) return;
    
    setCancelling(true);
    try {
      await apiFetch(`/api/events/${event.id}/cancel`, { method: "POST" });
      toast.success("Evento cancelado correctamente");
      fetchEvent();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo cancelar el evento");
      }
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const handleReopen = async () => {
    if (!event) return;
    
    setReopening(true);
    try {
      await apiFetch(`/api/events/${event.id}/reopen`, { method: "POST" });
      toast.success("Evento reopen correctamente");
      fetchEvent();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo reopen el evento");
      }
    } finally {
      setReopening(false);
    }
  };

  const handleEditSuccess = () => {
    fetchEvent();
    setShowEditModal(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isCancelled = event.status === "Cancelled";
  const canReopen = isCancelled && new Date(event.startDate) > new Date();
  const canComment = Boolean(event && (event.isCreator || event.isMember) && !isCancelled);
  const canCancel = event.isCreator && !isCancelled && event.status !== "Closed";

  const bgClass = categoryBg[event.eventCategoryName] || categoryBg.default;
  const statusStyle = statusBg[event.status] || statusBg.Open;
  const imageToShow = event.displayImageUrl || event.imageUrl || "/uploads/events/defaultprofile.png";

  return (
    <>
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {isCancelled && (
            <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2">
              <XCircle size={20} className="text-red-500" />
              <span className="text-sm font-medium text-red-700">Este evento ha sido cancelado</span>
            </div>
          )}
          
          <div className="w-full h-56 md:h-72 overflow-hidden bg-slate-100">
            <img
              src={imageToShow}
              alt={event.title}
              className={`w-full h-full object-cover ${isCancelled ? "opacity-50 grayscale" : ""}`}
            />
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                    {event.status === "Cancelled" ? "Cancelado" : event.status === "Open" ? "Activo" : event.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
              </div>
              
              {event.isCreator && !isCancelled && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowMembersModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <UserCheck size={14} />
                    Miembros
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={cancelling}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      {cancelling ? "Cancelando..." : "Cancelar"}
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
              
              {event.isCreator && isCancelled && canReopen && (
                <button
                  onClick={handleReopen}
                  disabled={reopening}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={14} />
                  {reopening ? "Reabriendo..." : "Reabrir evento"}
                </button>
              )}
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
                  {event.availableSlots > 0 ? (
                    <p className="text-xs text-green-600">{event.availableSlots} lugares disponibles</p>
                  ) : (
                    <p className="text-xs text-red-500">Evento lleno</p>
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

            {!isCancelled && !event.isCreator && !event.isMember && !event.isFull && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {joining ? "Uniéndose..." : "Unirse al evento"}
              </button>
            )}

            {!isCancelled && !event.isCreator && !event.isMember && event.isFull && (
              <div className="w-full bg-slate-200 text-slate-500 py-4 rounded-xl font-semibold text-center">
                Evento lleno
              </div>
            )}

            {!isCancelled && !event.isCreator && event.isMember && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-green-100 text-green-700 py-4 rounded-xl font-semibold text-center">
                  Ya estás inscrito en este evento
                </div>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  disabled={leaving}
                  className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {leaving ? "Abandonando..." : "Abandonar evento"}
                </button>
              </div>
            )}
          </div>

          <CommentsSection eventId={event.id} canComment={canComment} />
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

      <CreateEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        editEvent={event}
      />

      <EventMembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        eventId={event.id}
        eventTitle={event.title}
      />

      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeave}
        title="Abandonar evento"
        message="¿Estás seguro de que quieres abandonar este evento? Perderás tu lugar y tendrás que unirte nuevamente si lo deseas."
        confirmText={leaving ? "Abandonando..." : "Sí, abandonar"}
        variant="danger"
        loading={leaving}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar evento"
        message="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
        confirmText={deleting ? "Eliminando..." : "Sí, eliminar"}
        variant="danger"
        loading={deleting}
      />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancelar evento"
        message="¿Estás seguro de que quieres cancelar este evento? Esta acción notificará a todos los participantes. No se puede deshacer."
        confirmText={cancelling ? "Cancelando..." : "Sí, cancelar"}
        variant="danger"
        loading={cancelling}
      />
    </>
  );
}
