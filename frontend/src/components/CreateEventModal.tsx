"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, MapPin, Users, Lock, ImagePlus } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { CityViewModel, StateViewModel, CountryViewModel, EventCategoryViewModel, EventTypeViewModel } from "@/types/catalogs";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [countries, setCountries] = useState<CountryViewModel[]>([]);
  const [states, setStates] = useState<StateViewModel[]>([]);
  const [cities, setCities] = useState<CityViewModel[]>([]);
  const [categories, setCategories] = useState<EventCategoryViewModel[]>([]);
  const [types, setTypes] = useState<EventTypeViewModel[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    locationDetail: "",
    cityId: "",
    eventCategoryId: "",
    eventTypeId: "",
    maxCapacity: "",
    isPrivate: false,
  });

  const [createdEvent, setCreatedEvent] = useState<{ slug: string; accessCode?: string; isPrivate: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      loadCatalogs();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const loadCatalogs = async () => {
    try {
      const [countriesRes, categoriesRes, typesRes] = await Promise.all([
        apiFetch<CountryViewModel[]>("/api/countries"),
        apiFetch<EventCategoryViewModel[]>("/api/eventcategories"),
        apiFetch<EventTypeViewModel[]>("/api/eventtypes"),
      ]);
      setCountries(countriesRes || []);
      setCategories(categoriesRes || []);
      setTypes(typesRes || []);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar catálogos");
      }
    }
  };

  const loadStates = async (countryId: string) => {
    setSelectedState("");
    setCities([]);
    setForm({ ...form, cityId: "" });
    
    if (!countryId) {
      setStates([]);
      return;
    }

    try {
      const statesRes = await apiFetch<StateViewModel[]>(`/api/states/country/${countryId}`);
      setStates(statesRes || []);
    } catch (err) {
      toast.error("Error al cargar estados");
    }
  };

  const loadCities = async (stateId: string) => {
    setForm({ ...form, cityId: "" });
    
    if (!stateId) {
      setCities([]);
      return;
    }

    try {
      const citiesRes = await apiFetch<CityViewModel[]>(`/api/cities/state/${stateId}`);
      setCities(citiesRes || []);
    } catch (err) {
      toast.error("Error al cargar ciudades");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/events/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Error al subir imagen");
      }

      setImagePreview(data.data.imageUrl);
      setSelectedFile(file);
    } catch (err: any) {
      toast.error(err.message || "Error al subir imagen");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = form.startDate && form.startTime 
        ? new Date(`${form.startDate}T${form.startTime}:00`).toISOString()
        : new Date(form.startDate).toISOString();
      
      const endDateTime = form.endDate && form.endTime 
        ? new Date(`${form.endDate}T${form.endTime}:00`).toISOString()
        : new Date(form.endDate).toISOString();

      const payload = {
        title: form.title,
        description: form.description || null,
        startDate: startDateTime,
        endDate: endDateTime,
        locationDetail: form.locationDetail || null,
        cityId: parseInt(form.cityId),
        eventCategoryId: parseInt(form.eventCategoryId),
        eventTypeId: parseInt(form.eventTypeId),
        isPrivate: form.isPrivate,
        maxCapacity: parseInt(form.maxCapacity),
        imageUrl: imagePreview,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setCreatedEvent({
          slug: data.data.slug,
          accessCode: data.data.accessCode,
          isPrivate: data.data.isPrivate
        });
        toast.success(data.message || "Evento creado correctamente");
      } else {
        toast.error(data.message || "Error al crear evento");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (createdEvent) {
      onSuccess();
    }
    setForm({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      locationDetail: "",
      cityId: "",
      eventCategoryId: "",
      eventTypeId: "",
      maxCapacity: "",
      isPrivate: false,
    });
    setSelectedCountry("");
    setSelectedState("");
    setCities([]);
    setStates([]);
    setImagePreview(null);
    setSelectedFile(null);
    setCreatedEvent(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  if (createdEvent) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Evento creado exitosamente</h3>
            {createdEvent.isPrivate && createdEvent.accessCode && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700 mb-2">Código de acceso para tu evento privado:</p>
                <p className="text-2xl font-mono font-bold text-amber-900 tracking-widest">{createdEvent.accessCode}</p>
                <p className="text-xs text-amber-600 mt-2">Comparte este código con las personas que quieras invitar</p>
              </div>
            )}
            <button
              onClick={handleClose}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir al evento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Crear nuevo evento</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título del evento *
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                placeholder="Nombre de tu evento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                disabled={loading}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Describe tu evento..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha de inicio *
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    disabled={loading}
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <input
                    type="time"
                    required
                    disabled={loading}
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha de fin *
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    disabled={loading}
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <input
                    type="time"
                    required
                    disabled={loading}
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-28 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  País *
                </label>
                <select
                  required
                  disabled={loading}
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    loadStates(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona...</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado *
                </label>
                <select
                  required
                  disabled={loading || !selectedCountry}
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    loadCities(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona...</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ciudad *
                </label>
                <select
                  required
                  disabled={loading || !selectedState}
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría *
                </label>
                <select
                  required
                  disabled={loading}
                  value={form.eventCategoryId}
                  onChange={(e) => setForm({ ...form, eventCategoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo *
                </label>
                <select
                  required
                  disabled={loading}
                  value={form.eventTypeId}
                  onChange={(e) => setForm({ ...form, eventTypeId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona...</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <MapPin size={14} className="inline mr-1" />
                Dirección / Ubicación
              </label>
              <input
                type="text"
                disabled={loading}
                value={form.locationDetail}
                onChange={(e) => setForm({ ...form, locationDetail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                placeholder="Dirección del evento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <ImagePlus size={14} className="inline mr-1" />
                Imagen del evento
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={loading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || loadingImage}
                  className="px-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingImage ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImagePlus size={18} />
                  )}
                  Subir imagen
                </button>
                {imagePreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Users size={14} className="inline mr-1" />
                  Capacidad máxima *
                </label>
                <input
                  type="number"
                  required
                  disabled={loading}
                  min={1}
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  placeholder="Ej: 100"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={form.isPrivate}
                    onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="flex items-center gap-1 text-sm text-slate-700">
                    <Lock size={14} />
                    Evento privado
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear evento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}