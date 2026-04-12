"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Pagination from "@/components/Pagination";
import { toast } from "@/lib/toast";
import type { EventViewModel, EventsResponse } from "@/types/events";

export default function SubscriptionsPage() {
  const [events, setEvents] = useState<EventViewModel[]>([]);
  const [loading, setLoading] = useState(true);
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
    </div>
  );
}