"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, LayoutGrid, Heart, User, LogOut, Shield } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface SidebarUser {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profileImage?: string;
}

export default function CommonsLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch<SidebarUser>("/api/Users/currentUser");
        setUser(res);
      } catch {
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await apiFetch("/api/Users/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/login");
    }
  };

  const isAdmin = user?.role === "Admin";
  const userEmail = user?.email ?? "";
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || userEmail || "Usuario";
  const initials = (user?.firstName?.[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || "?") + (user?.lastName?.[0]?.toUpperCase() || "");

  const menuItems = [
    { href: "/home", label: "Inicio", icon: LayoutGrid },
    { href: "/events", label: "Eventos", icon: Calendar },
    { href: "/my-events", label: "Mis Eventos", icon: Calendar },
    { href: "/subscriptions", label: "Subscripciones", icon: Heart },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] text-white md:hidden shadow-md">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <button onClick={() => setSidebarVisible(!sidebarVisible)} className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#0f172a] text-white hidden md:flex shadow-md hover:bg-[#1e293b] transition-colors">
        {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-400 transform transition-transform duration-200 z-40 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${sidebarVisible ? "md:translate-x-0" : "md:-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="font-semibold text-white tracking-wide">Eventos App</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          <div>
            <h3 className="px-6 mb-3 text-[11px] font-semibold text-slate-500 tracking-wider">NAVEGACIÓN</h3>
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-[#1e293b] text-white relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-1 before:bg-blue-500" : "hover:bg-white/5 hover:text-white"}`}>
                      <Icon size={18} className={isActive ? "text-slate-300" : "text-slate-500"} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {isAdmin && (
            <div>
              <h3 className="px-6 mb-3 text-[11px] font-semibold text-amber-500 tracking-wider">ADMINISTRACIÓN</h3>
              <ul className="space-y-1 px-3">
                <li>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 hover:text-white">
                    <Shield size={18} className="text-amber-500" />
                    <span className="text-sm font-medium text-amber-400">Panel Admin</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-white/5 p-4 bg-[#0b1121]">
          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 mb-4 hover:bg-white/5 rounded-lg p-1 -mx-1 transition-colors">
            {user?.profileImage && user.profileImage.includes("/uploads") ? (
              <img src={user.profileImage} alt="Foto de perfil" className="w-10 h-10 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-blue-400 font-semibold text-sm border border-white/10">{initials}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">{isAdmin ? "Administrador" : "Usuario"}</p>
            </div>
            <User size={14} className="text-slate-500" />
          </Link>
          <button onClick={handleLogout} disabled={loadingLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
            <LogOut size={16} />
            {loadingLogout ? "Saliendo..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-6 md:p-10 transition-all duration-200 ${sidebarVisible ? "md:ml-64" : "md:ml-0"}`}>
        {children}
      </main>

      {isOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
