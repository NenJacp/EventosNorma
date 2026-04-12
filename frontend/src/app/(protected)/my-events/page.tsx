"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import CreateEventModal from "@/components/CreateEventModal";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventsResponse } from "@/types/events";

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const fetchMyEvents = async (page: number) => {
    setLoading(true);
    try {
      const data = await apiFetch<EventsResponse>(
        `/api/events/me/created?PageNumber=${page}&PageSize=12`
      );
      setEvents(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setCurrentPage(page);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar tus eventos");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchMyEvents(page);
  };

  const handleEventCreated = () => {
    fetchMyEvents(1);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Eventos</h1>
          <p className="text-sm text-slate-500">
            Gestiona los eventos que has creado
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Crear evento
        </button>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">
        {totalCount} evento{totalCount !== 1 ? "s" : ""} creado{totalCount !== 1 ? "s" : ""}
      </span>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 mb-4">No has creado ningún evento aún</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Crear tu primer evento
          </button>
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
                description={event.description}
                startDate={event.startDate}
                locationDetail={event.locationDetail}
                cityName={event.cityName}
                categoryName={event.eventCategoryName}
                maxCapacity={event.maxCapacity}
                currentCapacity={event.currentCapacity}
                showCapacity={true}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <CreateEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleEventCreated}
      />
    </div>
  );
}