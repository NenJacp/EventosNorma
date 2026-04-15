"use client";

import { useEffect, useState, useCallback } from "react";
import CatalogTable from "@/components/admin/CatalogTable";
import { apiFetch } from "@/lib/api";

interface CountryItem {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
  createdAt: string;
  statesCount: number;
}

export default function CountriesPage() {
  const [items, setItems] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<CountryItem[]>("/api/Catalogs/countries?includeInactive=true");
      setItems(data);
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Record<string, string | number>) => {
    await apiFetch("/api/Catalogs/countries", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
      }),
    });
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    await apiFetch(`/api/Catalogs/countries/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
      }),
    });
  };

  const handleToggle = async (id: number) => {
    await apiFetch(`/api/Catalogs/countries/${id}/toggle`, {
      method: "POST",
    });
  };

  return (
    <CatalogTable
      title="Países"
      singularTitle="País"
      subtitle="Gestión de países"
      items={items}
      loading={loading}
      onRefresh={fetchItems}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggle={handleToggle}
      emptyMessage="No hay países registrados"
    />
  );
}
