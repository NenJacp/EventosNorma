"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Search, Ban, CheckCircle, X } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isBanned: boolean;
  banReason: string | null;
  bannedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showBanned, setShowBanned] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [banReason, setBanReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<UserItem[]>("/api/Users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesBanned = showBanned ? true : !user.isBanned;
    return matchesSearch && matchesRole && matchesBanned;
  });

  const handleBan = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      await apiFetch(`/api/Users/${selectedUser.id}/ban`, { method: "POST", body: JSON.stringify({ reason: banReason || null }) });
      toast.success("Usuario baneado correctamente");
      setSelectedUser(null);
      setBanReason("");
      fetchUsers();
    } catch (err) {
      console.error("Error banning user:", err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo banear al usuario");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleUnban = async (userId: number) => {
    try {
      await apiFetch(`/api/Users/${userId}/unban`, { method: "POST" });
      toast.success("Usuario desbaneado correctamente");
      fetchUsers();
    } catch (err) {
      console.error("Error unbanning user:", err);
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("No se pudo desbanear al usuario");
      }
    }
  };

  const formatDate = (dateStr: string | null) => !dateStr ? "-" : new Date(dateStr).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500">Ver, banear y desbanear usuarios</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input type="text" placeholder="Buscar usuarios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los roles</option>
            <option value="Admin">Admin</option>
            <option value="User">Usuario</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={showBanned} onChange={(e) => setShowBanned(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
            Mostrar baneados
          </label>
        </div>
      </div>

      <span className="text-sm text-slate-500 mb-4 block">{filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""}</span>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Registro</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Baneado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50 ${user.isBanned ? "bg-red-50/50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">{user.firstName[0]}{user.lastName[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isBanned ? "bg-red-100 text-red-700" : user.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                      {user.isBanned ? "Baneado" : user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">{user.isBanned ? <div><p className="text-sm text-red-600">{user.banReason || "Sin motivo"}</p><p className="text-xs text-slate-500">{formatDate(user.bannedAt)}</p></div> : <span className="text-sm text-slate-400">-</span>}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.role !== "Admin" && (
                        user.isBanned ? (
                          <button onClick={() => handleUnban(user.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Desbanear"><CheckCircle size={18} /></button>
                        ) : (
                          <button onClick={() => { setSelectedUser(user); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Banear"><Ban size={18} /></button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedUser(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Ban className="text-red-500" size={20} />Banear Usuario</h2>
                <button onClick={() => setSelectedUser(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm">{selectedUser.firstName[0]}{selectedUser.lastName[0]}</div>
                  <div><p className="text-sm font-medium">{selectedUser.firstName} {selectedUser.lastName}</p><p className="text-xs text-slate-500">{selectedUser.email}</p></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motivo del ban (opcional)</label>
                  <textarea value={banReason} onChange={(e) => setBanReason(e.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none" placeholder="Describe el motivo..." />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setSelectedUser(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                  <button onClick={handleBan} disabled={processing} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{processing ? "Baneando..." : "Banear"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
