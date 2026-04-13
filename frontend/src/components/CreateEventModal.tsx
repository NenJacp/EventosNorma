"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Lock,
  ImagePlus,
  CheckCircle2,
} from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { CityViewModel, StateViewModel, CountryViewModel, EventCategoryViewModel, EventTypeViewModel } from "@/types/catalogs";
import type { EventViewModel } from "@/types/events";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEvent?: EventViewModel | null;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess, editEvent }: CreateEventModalProps) {
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
  const [initialCityId, setInitialCityId] = useState<string>("");

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

  const [createdEvent, setCreatedEvent] = useState<{
    slug: string;
    accessCode?: string;
    isPrivate: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCatalogs();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (editEvent) {
      const startDate = new Date(editEvent.startDate);
      const endDate = new Date(editEvent.endDate);
      
      setForm({
        title: editEvent.title,
        description: editEvent.description || "",
        startDate: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split("T")[0],
        endTime: endDate.toTimeString().slice(0, 5),
        locationDetail: editEvent.locationDetail || "",
        cityId: "",
        eventCategoryId: "",
        eventTypeId: "",
        maxCapacity: editEvent.maxCapacity.toString(),
        isPrivate: editEvent.isPrivate,
      });
      
      setImagePreview(editEvent.imageUrl || null);
      setInitialCityId("");
    }
  }, [editEvent]);

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
    setForm((prev) => ({ ...prev, cityId: "" }));

    if (!countryId) {
      setStates([]);
      return;
    }

    try {
      const statesRes = await apiFetch<StateViewModel[]>(
        `/api/states/country/${countryId}`
      );
      setStates(statesRes || []);
    } catch {
      toast.error("Error al cargar estados");
    }
  };

  const loadCities = async (stateId: string) => {
    setForm((prev) => ({ ...prev, cityId: "" }));

    if (!stateId) {
      setCities([]);
      return;
    }

    try {
      const citiesRes = await apiFetch<CityViewModel[]>(
        `/api/cities/state/${stateId}`
      );
      setCities(citiesRes || []);
    } catch {
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
      toast.success("Imagen subida correctamente");
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
      const startDateTime =
        form.startDate && form.startTime
          ? new Date(`${form.startDate}T${form.startTime}:00`).toISOString()
          : new Date(form.startDate).toISOString();

      const endDateTime =
        form.endDate && form.endTime
          ? new Date(`${form.endDate}T${form.endTime}:00`).toISOString()
          : new Date(form.endDate).toISOString();

      const payload = {
        id: editEvent?.id,
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

      const isEditing = !!editEvent;
      const url = isEditing ? `/api/events/${editEvent!.id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isEditing) {
          toast.success(data.message || "Evento actualizado correctamente");
          onSuccess();
          handleClose();
        } else {
          setCreatedEvent({
            slug: data.data.slug,
            accessCode: data.data.accessCode,
            isPrivate: data.data.isPrivate
          });
          toast.success(data.message || "Evento creado correctamente");
        }
      } else {
        toast.error(data.message || `Error al ${isEditing ? "actualizar" : "crear"} evento`);
      }
    } catch (err: any) {
      toast.error(err.message || `Error al ${editEvent ? "actualizar" : "crear"} evento`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (createdEvent) {
      onSuccess();
    }
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  if (createdEvent) {
    return (
      <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        >
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={30} />
            </div>

            <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
              Evento creado
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tu evento se guardó correctamente en la plataforma.
            </p>

            {createdEvent.isPrivate && createdEvent.accessCode && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Código de acceso
                </p>
                <p className="mt-2 font-mono text-3xl font-extrabold tracking-[0.25em] text-amber-900">
                  {createdEvent.accessCode}
                </p>
                <p className="mt-2 text-xs text-amber-700">
                  Compártelo solo con tus invitados.
                </p>
              </div>
            )}

            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3.5 text-sm font-bold text-white transition hover:from-blue-500 hover:to-blue-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Nuevo evento
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              Crear evento
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa la información para publicar tu evento.
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 space-y-6 overflow-y-auto px-6 py-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Portada del evento
              </label>

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
                className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40 disabled:opacity-50"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={24} className="text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    {loadingImage ? "Subiendo imagen..." : "Subir imagen"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Agrega una portada para que tu evento se vea mejor.
                  </p>
                </div>
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Título del evento *
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  placeholder="Nombre de tu evento"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Descripción
                </label>
                <textarea
                  disabled={loading}
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  placeholder="Describe tu evento..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Calendar size={15} className="text-blue-600" />
                    Inicio *
                  </label>
                  <div className="grid grid-cols-[1fr_120px] gap-2">
                    <input
                      type="date"
                      required
                      disabled={loading}
                      value={form.startDate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      type="time"
                      required
                      disabled={loading}
                      value={form.startTime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Calendar size={15} className="text-blue-600" />
                    Fin *
                  </label>
                  <div className="grid grid-cols-[1fr_120px] gap-2">
                    <input
                      type="date"
                      required
                      disabled={loading}
                      value={form.endDate}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                      type="time"
                      required
                      disabled={loading}
                      value={form.endTime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Ciudad *
                  </label>
                  <select
                    required
                    disabled={loading || !selectedState}
                    value={form.cityId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, cityId: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin size={15} className="text-blue-600" />
                  Dirección / ubicación
                </label>
                <input
                  type="text"
                  disabled={loading}
                  value={form.locationDetail}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      locationDetail: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Dirección del evento"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Categoría *
                  </label>
                  <select
                    required
                    disabled={loading}
                    value={form.eventCategoryId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        eventCategoryId: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Tipo *
                  </label>
                  <select
                    required
                    disabled={loading}
                    value={form.eventTypeId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        eventTypeId: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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

              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Users size={15} className="text-blue-600" />
                    Capacidad máxima *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    disabled={loading}
                    value={form.maxCapacity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxCapacity: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Ej: 100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isPrivate: !prev.isPrivate,
                    }))
                  }
                  disabled={loading}
                  className={`flex h-[50px] items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${
                    form.isPrivate
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <Lock size={15} />
                  {form.isPrivate ? "Privado" : "Público"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 text-sm font-bold text-white transition hover:from-blue-500 hover:to-blue-700 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}