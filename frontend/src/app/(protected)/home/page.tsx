"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventsResponse } from "@/types/events";

export default function HomePage() {
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inicio</h1>
          <p className="text-sm text-slate-500">
            Explora los próximos eventos
          </p>
        </div>
        <span className="text-sm text-slate-500">
          {totalCount} evento{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
        </span>
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
    </div>
  );
}