"use client";

import { useEffect, useState, useCallback } from "react";
import CatalogTable from "@/components/admin/CatalogTable";
import { apiFetch } from "@/lib/api";

interface StateItem {
  id: number;
  name: string;
  code: string | null;
  isActive: boolean;
  countryId: number;
  countryName: string;
  citiesCount: number;
}

type TableItem = StateItem & { parentName: string };

export default function StatesPage() {
  const [items, setItems] = useState<TableItem[]>([]);
  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const [statesData, countriesData] = await Promise.all([
        apiFetch<StateItem[]>("/api/Catalogs/states?includeInactive=true"),
        apiFetch<{ id: number; name: string }[]>("/api/Catalogs/countries"),
      ]);
      setItems(statesData.map(s => ({ ...s, parentName: s.countryName })));
      setCountries(countriesData);
    } catch (err) {
      console.error("Error fetching states:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: Record<string, string | number>) => {
    await apiFetch("/api/Catalogs/states", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
        countryId: data.parentId,
      }),
    });
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    await apiFetch(`/api/Catalogs/states/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        code: data.code || null,
        countryId: data.parentId,
      }),
    });
  };

  const handleToggle = async (id: number) => {
    await apiFetch(`/api/Catalogs/states/${id}/toggle`, {
      method: "POST",
    });
  };

  return (
    <CatalogTable
      title="Estados"
      subtitle="Gestión de estados/regiones"
      items={items}
      loading={loading}
      onRefresh={fetchItems}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggle={handleToggle}
      parentLabel="País"
      parentOptions={countries}
      emptyMessage="No hay estados registrados"
    />
  );
}
