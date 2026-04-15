"use client";

import { useEffect, useState, useCallback } from "react";
import CatalogTable from "@/components/admin/CatalogTable";
import { apiFetch } from "@/lib/api";

interface EventTypeItem {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  eventsCount: number;
}

export default function EventTypesPage() {
  const [items, setItems] = useState<EventTypeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<EventTypeItem[]>("/api/Catalogs/event-types?includeInactive=true");
      setItems(data);
    } catch (err) {
      console.error("Error fetching event types:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Record<string, string | number>) => {
    await apiFetch("/api/Catalogs/event-types", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description || null,
      }),
    });
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    await apiFetch(`/api/Catalogs/event-types/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        description: data.description || null,
      }),
    });
  };

  const handleToggle = async (id: number) => {
    await apiFetch(`/api/Catalogs/event-types/${id}/toggle`, {
      method: "POST",
    });
  };

  return (
    <CatalogTable
      title="Tipos de Evento"
      subtitle="Gestión de tipos de evento"
      items={items}
      loading={loading}
      onRefresh={fetchItems}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggle={handleToggle}
      hasDescription
      hasCode={false}
      emptyMessage="No hay tipos de evento registrados"
    />
  );
}
