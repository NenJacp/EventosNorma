"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, ApiError, API_URL } from "@/lib/api";
import { toast } from "@/lib/toast";
import { User, Camera, Loader2, Calendar, Users, Heart } from "lucide-react";

interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

interface UserStats {
  eventsCreated: number;
  subscriptionsActive: number;
}

interface RecentEvent {
  id: number;
  title: string;
  slug: string;
  startDate: string;
  isCreator: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>({ eventsCreated: 0, subscriptionsActive: 0 });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await apiFetch<CurrentUser>("/api/Users/currentUser");
      setUser(res);
      setFirstName(res.firstName);
      setLastName(res.lastName);
      setPreviewImage(res.profileImage || null);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar el perfil");
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    setLoadingEvents(true);
    try {
      const [myEvents, mySubscriptions] = await Promise.all([
        apiFetch<{ items: RecentEvent[]; totalCount: number }>("/api/events/me/created?PageNumber=1&PageSize=5"),
        apiFetch<{ items: RecentEvent[]; totalCount: number }>("/api/events/me/joined?PageNumber=1&PageSize=5"),
      ]);
      setStats({
        eventsCreated: myEvents.totalCount,
        subscriptionsActive: mySubscriptions.totalCount,
      });
      setRecentEvents([
        ...myEvents.items.map(e => ({ ...e, isCreator: true })),
        ...mySubscriptions.items.map(e => ({ ...e, isCreator: false })),
      ].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5));
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserStats();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("El nombre y apellido son requeridos");
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`/api/Users/${user.id}/profile`, {
        method: "PUT",
        body: JSON.stringify({
          userId: user.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      setUser({ ...user, firstName, lastName });
      toast.success("Perfil actualizado correctamente");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al actualizar el perfil");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/Users/${user.id}/profile-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al subir la imagen");
      }

      const data = await res.json();
      const imageUrl = data.data.imageUrl;

      setPreviewImage(imageUrl);
      setUser({ ...user, profileImage: imageUrl });

      toast.success("Foto de perfil actualizada");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al subir la imagen");
      }
    } finally {
      setUploading(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-sm text-slate-500">Gestiona tu información y estadísticas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.eventsCreated}</p>
            <p className="text-sm text-slate-500">Eventos creados</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Heart size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.subscriptionsActive}</p>
            <p className="text-sm text-slate-500">Inscripciones</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Users size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.eventsCreated + stats.subscriptionsActive}
            </p>
            <p className="text-sm text-slate-500">Total actividad</p>
          </div>
        </div>
      </div>

      {recentEvents.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Actividad reciente</h2>
            <div className="flex gap-3">
              <Link href="/my-events" className="text-sm text-blue-600 hover:text-blue-700">
                Ver mis eventos
              </Link>
              <Link href="/subscriptions" className="text-sm text-blue-600 hover:text-blue-700">
                Ver inscripciones
              </Link>
            </div>
          </div>
          {loadingEvents ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <Link
                  key={`${event.id}-${event.isCreator}`}
                  href={`/events/${event.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                      event.isCreator ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}>
                      {formatDate(event.startDate)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 line-clamp-1">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {event.isCreator ? "Creador" : "Inscrito"}
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Información personal</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {previewImage && previewImage.includes("/uploads") ? (
                <img
                  src={previewImage}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-semibold text-slate-400">
                    {initials}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleImageClick}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm text-slate-500 mt-2">
              Haz clic en la cámara para cambiar tu foto
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Apellido
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu apellido"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}