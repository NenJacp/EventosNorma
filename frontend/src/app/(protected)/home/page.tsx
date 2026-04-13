"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Lock, Sparkles } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventsResponse } from "@/types/events";

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async (page: number, search: string = "") => {
    setLoading(true);

    try {
      let url = `/api/events?PageNumber=${page}&PageSize=12&IsActive=true&ExcludeJoinedEvents=true`;
      if (search.trim()) {
        url += `&Search=${encodeURIComponent(search.trim())}`;
      }
      const data = await apiFetch<EventsResponse>(url);
      setEvents(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar eventos");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, searchQuery);
  }, []);

  const handlePageChange = (page: number) => {
    fetchEvents(page, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(1, searchQuery);
  };

  const handleCodeModalSuccess = (eventData: EventViewModel) => {
    setShowCodeModal(false);
    router.push(`/events/${eventData.slug}?code=${eventData.accessCode || ""}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#f1f6ff_35%,#ffffff_100%)]">
      <div className="pointer-events-none absolute left-[-100px] top-[-80px] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative space-y-8 p-4 sm:p-6 lg:p-8">
<section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-[linear-gradient(135deg,#05070a_0%,#0d1118_60%,#101827_100%)] shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
  <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-7">

    {/* Texto */}
    <div className="max-w-xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100">
        <Sparkles size={12} />
        Plataforma de eventos
      </div>

      <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
        Descubre tus próximos{" "}
        <span className="text-blue-400">eventos</span>
      </h1>

      <p className="mt-2 text-sm text-white/70">
        Explora eventos activos o accede a uno privado con tu código.
      </p>
    </div>

    {/* Acciones */}
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => setShowCodeModal(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(21,101,255,0.25)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-700"
      >
        <Lock size={14} />
        Código privado
      </button>

      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
        {totalCount} evento{totalCount !== 1 ? "s" : ""}
      </div>
    </div>

  </div>
</section>

        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Inicio
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                Eventos disponibles
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Explora los próximos eventos activos en la plataforma.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                {totalCount} resultado{totalCount !== 1 ? "s" : ""}
              </div>

              {totalPages > 1 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4"
                >
                  <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="mt-5 h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CalendarDays size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No hay eventos disponibles
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Por ahora no encontramos eventos activos. Intenta nuevamente más
                tarde o accede a uno privado con tu código de invitación.
              </p>

              <button
                onClick={() => setShowCodeModal(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Lock size={16} />
                Ingresar con código privado
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    slug={event.slug}
                    title={event.title}
                    eventTypeName={event.eventTypeName}
                    startDate={event.startDate}
                    locationDetail={event.locationDetail}
                    cityName={event.cityName}
                    categoryName={event.eventCategoryName}
                    maxCapacity={event.maxCapacity}
                    currentCapacity={event.currentCapacity}
                    showCapacity={false}
                    imageUrl={event.imageUrl}
                    isPrivate={event.isPrivate}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                  <p className="text-sm text-slate-500">
                    Página <span className="font-semibold">{currentPage}</span> de{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      disabled={currentPage >= totalPages}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <JoinByCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        slug=""
        onSuccess={handleCodeModalSuccess}
      />
    </div>
  );
}