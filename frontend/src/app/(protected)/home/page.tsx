"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import { toast } from "@/lib/toast";
import { Lock } from "lucide-react";
import type { EventViewModel, EventsResponse } from "@/types/events";

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const fetchEvents = async (page: number) => {
    setLoading(true);
    try {
      const data = await apiFetch<EventsResponse>(
        `/api/events?PageNumber=${page}&PageSize=12&IsActive=true`
      );
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
    fetchEvents(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchEvents(page);
  };

  const handleCodeModalSuccess = (eventData: EventViewModel) => {
    setShowCodeModal(false);
    router.push(`/events/${eventData.slug}?code=${eventData.accessCode || ""}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inicio</h1>
          <p className="text-sm text-slate-500">
            Explora los próximos eventos
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors shadow-sm"
          >
            <Lock size={18} />
            <span className="text-sm font-medium">Código privado</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <span className="text-sm text-slate-500 whitespace-nowrap bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              {totalCount} evento{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500">No hay eventos disponibles</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

          <div className="mt-8 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      <JoinByCodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        slug=""
        onSuccess={handleCodeModalSuccess}
      />
    </div>
  );
}
