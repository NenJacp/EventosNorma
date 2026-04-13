"use client";

import { useState } from "react";
import { Edit2, ToggleLeft, ToggleRight, Search, Plus, X } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CatalogItem {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  isActive: boolean;
  parentName?: string;
  parentId?: number;
  relatedCount?: number;
}

interface CatalogTableProps<T extends CatalogItem> {
  title: string;
  subtitle: string;
  items: T[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (data: Record<string, string | number>) => Promise<void>;
  onUpdate: (id: number, data: Record<string, string | number>) => Promise<void>;
  onToggle: (id: number) => Promise<void>;
  parentLabel?: string;
  parentOptions?: { id: number; name: string }[];
  hasDescription?: boolean;
  emptyMessage: string;
}

export default function CatalogTable<T extends CatalogItem>({
  title,
  subtitle,
  items,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onToggle,
  parentLabel,
  parentOptions,
  hasDescription = false,
  emptyMessage,
}: CatalogTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    parentId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = showInactive ? true : item.isActive;
    return matchesSearch && matchesActive;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ name: "", code: "", description: "", parentId: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      code: item.code || "",
      description: item.description || "",
      parentId: item.parentId?.toString() || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const data: Record<string, string | number> = {
        name: formData.name,
      };

      if (formData.code) data.code = formData.code;
      if (hasDescription && formData.description) {
        data.description = formData.description;
      }
      if (parentLabel && formData.parentId) {
        data.parentId = parseInt(formData.parentId);
      }

      if (editingItem) {
        await onUpdate(editingItem.id, data);
      } else {
        await onCreate(data);
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await onToggle(id);
      onRefresh();
    } catch (err) {
      console.error("Error toggling item:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Mostrar inactivos
          </label>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Nuevo
          </button>
        </div>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">
        {filteredItems.length} elemento{filteredItems.length !== 1 ? "s" : ""}
      </span>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                  {hasDescription && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                  {parentLabel && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{parentLabel}</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Registros relacionados</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    </td>
                    {hasDescription && (
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 max-w-xs truncate">
                          {item.description || "-"}
                        </p>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 font-mono">
                        {item.code || "-"}
                      </span>
                    </td>
                    {parentLabel && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {item.parentName || "-"}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {item.relatedCount ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={item.isActive ? "Desactivar" : "Activar"}
                        >
                          {item.isActive ? (
                            <ToggleRight size={20} />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingItem ? "Editar" : "Nuevo"} {title.replace(/s$/, "")}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nombre del elemento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                    placeholder="Código (opcional)"
                  />
                </div>

                {hasDescription && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      placeholder="Descripción (opcional)"
                    />
                  </div>
                )}

                {parentLabel && parentOptions && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {parentLabel} *
                    </label>
                    <select
                      required
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Seleccionar {parentLabel}</option>
                      {parentOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
