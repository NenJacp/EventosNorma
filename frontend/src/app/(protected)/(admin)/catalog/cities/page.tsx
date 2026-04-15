"use client";

import { useEffect, useState, useCallback } from "react";
import CatalogTable from "@/components/admin/CatalogTable";
import { apiFetch } from "@/lib/api";

interface CityItem {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
  stateId: number;
  stateName: string;
  countryName: string;
}

interface StateOption {
  id: number;
  name: string;
}

type TableItem = CityItem & { parentName: string };

export default function CitiesPage() {
  const [items, setItems] = useState<TableItem[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const [citiesData, statesData] = await Promise.all([
        apiFetch<CityItem[]>("/api/Catalogs/cities?includeInactive=true"),
        apiFetch<StateOption[]>("/api/Catalogs/states"),
      ]);
      setItems(citiesData.map(c => ({ ...c, parentName: c.stateName })));
      setStates(statesData);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Record<string, string | number>) => {
    await apiFetch("/api/Catalogs/cities", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
        stateId: data.parentId,
      }),
    });
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    await apiFetch(`/api/Catalogs/cities/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
        stateId: data.parentId,
      }),
    });
  };

  const handleToggle = async (id: number) => {
    await apiFetch(`/api/Catalogs/cities/${id}/toggle`, {
      method: "POST",
    });
  };

  return (
    <CatalogTable
      title="Ciudades"
      singularTitle="Ciudad"
      subtitle="Gestión de ciudades"
      items={items}
      loading={loading}
      onRefresh={fetchItems}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggle={handleToggle}
      parentLabel="Estado"
      parentOptions={states}
      emptyMessage="No hay ciudades registradas"
    />
  );
}
