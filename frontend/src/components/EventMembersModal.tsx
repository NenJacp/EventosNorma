"use client";

import { useEffect, useState } from "react";
import { X, Users, Ban, UserCheck } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

interface EventMemberViewModel {
  id: number;
  userId: number;
  userName: string;
  userProfileImage: string | null;
  joinedAt: string;
  isBanned: boolean;
  bannedAt: string | null;
  isCreator: boolean;
}

interface EventMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventTitle: string;
}

export default function EventMembersModal({ isOpen, onClose, eventId, eventTitle }: EventMembersModalProps) {
  const [members, setMembers] = useState<EventMemberViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "banned">("active");

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, eventId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<EventMemberViewModel[]>(`/api/events/${eventId}/members`);
      setMembers(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al cargar miembros");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: number) => {
    if (!confirm("¿Estás seguro de banear a este usuario?")) return;
    
    setActionLoading(userId);
    try {
      await apiFetch(`/api/events/${eventId}/members/${userId}/ban`, { method: "POST" });
      toast.success("Usuario baneado correctamente");
      fetchMembers();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al banear usuario");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId: number) => {
    setActionLoading(userId);
    try {
      await apiFetch(`/api/events/${eventId}/members/${userId}/unban`, { method: "POST" });
      toast.success("Usuario desbaneado correctamente");
      fetchMembers();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al desbanear usuario");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filteredMembers = members.filter(m => {
    if (filter === "active") return !m.isBanned && !m.isCreator;
    if (filter === "banned") return m.isBanned;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-slate-500" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Miembros del evento</h2>
              <p className="text-sm text-slate-500 truncate max-w-md">{eventTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === "active" ? "bg-blue-100 text-blue-700" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Activos ({members.filter(m => !m.isBanned && !m.isCreator).length})
          </button>
          <button
            onClick={() => setFilter("banned")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === "banned" ? "bg-red-100 text-red-700" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Baneados ({members.filter(m => m.isBanned).length})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === "all" ? "bg-slate-200 text-slate-700" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Todos ({members.length})
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">
                {filter === "banned" ? "No hay usuarios baneados" : "No hay miembros"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <li key={member.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    {member.userProfileImage ? (
                      <img
                        src={member.userProfileImage}
                        alt={member.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                        {member.userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        {member.userName}
                        {member.isCreator && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                            Creador
                          </span>
                        )}
                        {member.isBanned && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded-full">
                            Baneado
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        Se unió el {formatDate(member.joinedAt)}
                        {member.isBanned && member.bannedAt && ` · Baneado el ${formatDate(member.bannedAt)}`}
                      </p>
                    </div>
                  </div>
                  
                  {!member.isCreator && (
                    <div>
                      {member.isBanned ? (
                        <button
                          onClick={() => handleUnban(member.userId)}
                          disabled={actionLoading === member.userId}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserCheck size={16} />
                          {actionLoading === member.userId ? "Desbaneando..." : "Desbanear"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBan(member.userId)}
                          disabled={actionLoading === member.userId}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Ban size={16} />
                          {actionLoading === member.userId ? "Baneando..." : "Banear"}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
