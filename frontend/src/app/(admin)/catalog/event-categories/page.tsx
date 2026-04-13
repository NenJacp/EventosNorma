"use client";

import { useEffect, useState, useCallback } from "react";
import CatalogTable from "@/components/admin/CatalogTable";
import { apiFetch } from "@/lib/api";

interface EventCategoryItem {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  eventsCount: number;
}

export default function EventCategoriesPage() {
  const [items, setItems] = useState<EventCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<EventCategoryItem[]>("/api/Catalogs/event-categories?includeInactive=true");
      setItems(data);
    } catch (err) {
      console.error("Error fetching event categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Record<string, string | number>) => {
    await apiFetch("/api/Catalogs/event-categories", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description || null,
      }),
    });
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    await apiFetch(`/api/Catalogs/event-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        description: data.description || null,
      }),
    });
  };

  const handleToggle = async (id: number) => {
    await apiFetch(`/api/Catalogs/event-categories/${id}/toggle`, {
      method: "POST",
    });
  };

  return (
    <CatalogTable
      title="Categorías de Evento"
      subtitle="Gestión de categorías de evento"
      items={items}
      loading={loading}
      onRefresh={fetchItems}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggle={handleToggle}
      hasDescription
      emptyMessage="No hay categorías registradas"
    />
  );
}
