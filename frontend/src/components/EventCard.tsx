"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

export interface EventCardProps {
  id: number;
  title: string;
  slug: string;
  eventTypeName: string;
  startDate: string;
  locationDetail: string;
  cityName: string;
  categoryName: string;
  maxCapacity: number;
  currentCapacity: number;
  isFull?: boolean;
  showCapacity?: boolean;
  imageUrl?: string;
}

const categoryColors: Record<string, string> = {
  Música: "tag--blue",
  Tecnología: "tag--purple",
  Cultura: "tag--green",
  Deportivo: "tag--amber",
  Social: "tag--pink",
  default: "tag--blue",
};

export default function EventCard({
  id,
  slug,
  title,
  eventTypeName,
  startDate,
  locationDetail,
  cityName,
  categoryName,
  maxCapacity,
  currentCapacity,
  showCapacity = false,
  imageUrl,
}: EventCardProps) {
  const tagClass = categoryColors[categoryName] || categoryColors.default;
  const availableSlots = maxCapacity - currentCapacity;
  const isFull = availableSlots <= 0 && maxCapacity > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("es-MX", options);
  };

  const emojis: Record<string, string> = {
    Música: "🎵",
    Tecnología: "💻",
    Cultura: "🌿",
    Deportivo: "⚽",
    Social: "🎉",
    default: "📅",
  };

  const emoji = emojis[categoryName] || emojis.default;

  return (
    <Link href={`/events/${slug}`} className="group block">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Imagen o placeholder */}
        {imageUrl ? (
          <div className="w-full h-32 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="w-full h-32 flex items-center justify-center text-5xl"
            style={{
              backgroundColor:
                categoryName === "Música"
                  ? "#dbeafe"
                  : categoryName === "Tecnología"
                  ? "#ede9fe"
                  : categoryName === "Cultura"
                  ? "#dcfce7"
                  : categoryName === "Deportivo"
                  ? "#fef3c7"
                  : "#fce7f3",
            }}
          >
            {emoji}
          </div>
        )}

        {/* Cuerpo */}
        <div className="p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`event-card__tag tag inline-block text-[10px] font-medium px-2 py-1 rounded-full ${tagClass}`}>
              {categoryName}
            </span>
            <span className="inline-block text-[10px] font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {eventTypeName}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 mb-3 line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
            <MapPin size={12} />
            <span className="truncate">
              {cityName}
              {locationDetail && ` · ${locationDetail}`}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
            <span className="text-[11px] text-slate-400">
              <Calendar size={12} className="inline mr-1" />
              {formatDate(startDate)}
            </span>

            {showCapacity && (
              <span
                className={`text-[11px] font-medium ${
                  isFull ? "text-red-500" : "text-slate-500"
                }`}
              >
                <Users size={12} className="inline mr-1" />
                {isFull ? "Lleno" : `${availableSlots} disponibles`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}