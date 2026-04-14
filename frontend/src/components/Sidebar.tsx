"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, LogOut, Menu, X, LayoutGrid, Heart, User, Users, Globe, MapPin, Layers, Tag, Database, BarChart3 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

interface SidebarUser {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profileImage?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  visible: boolean;
}

const mainSections = [
  {
    title: "PRINCIPAL",
    items: [
      { href: "/home", label: "Inicio", icon: LayoutGrid },
      { href: "/my-events", label: "Mis Eventos", icon: Calendar },
      { href: "/subscriptions", label: "Subscripciones", icon: Heart },
    ],
  },
];

const adminSections = [
  {
    title: "ADMINISTRACIÓN",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/usuarios", label: "Usuarios", icon: Users },
      { href: "/all-events", label: "Todos los Eventos", icon: Calendar },
    ],
  },
  {
    title: "CATÁLOGOS",
    items: [
      { href: "/catalog/countries", label: "Países", icon: Globe },
      { href: "/catalog/states", label: "Estados", icon: Layers },
      { href: "/catalog/cities", label: "Ciudades", icon: MapPin },
      { href: "/catalog/event-categories", label: "Categorías", icon: Tag },
      { href: "/catalog/event-types", label: "Tipos de Evento", icon: Database },
    ],
  },
];

export default function Sidebar({ isOpen, onToggle, visible }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch<{
          id: number;
          firstName: string;
          lastName: string;
          email: string;
          role?: string;
          profileImage?: string;
        }>("/api/Users/currentUser");
        
        setUser({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          role: res.role,
          profileImage: res.profileImage,
        });
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
  const initials =
    (user?.firstName?.[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || "?") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  const menuSections = isAdmin ? [...mainSections, ...adminSections] : mainSections;

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-400 transform transition-transform duration-200 z-40 flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      ${visible ? "md:translate-x-0" : "md:-translate-x-full"}
    `}
    >
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="font-semibold text-white tracking-wide">
          Eventos App
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {isAdmin && (
          <div>
            <h3 className="px-6 mb-3 text-[11px] font-semibold text-amber-500 tracking-wider">
              ADMINISTRACIÓN
            </h3>
            <ul className="space-y-1 px-3">
              <li>
                <Link
                  href="/admin/dashboard"
                  onClick={() => onToggle()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Shield size={18} className="text-amber-500" />
                  <span className="text-sm font-medium text-amber-400">Panel Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-6 mb-3 text-[11px] font-semibold text-slate-500 tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onToggle()}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#1e293b] text-white relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-1 before:bg-blue-500"
                          : "hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? "text-slate-300" : "text-slate-500"}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User Profile & Logout (Bottom) */}
      <div className="border-t border-white/5 p-4 bg-[#0b1121]">
        <Link
          href="/profile"
          onClick={() => onToggle()}
          className="flex items-center gap-3 px-2 mb-4 hover:bg-white/5 rounded-lg p-1 -mx-1 transition-colors"
        >
          {user?.profileImage && user.profileImage.includes("/uploads") ? (
            <img
              src={user.profileImage}
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-blue-400 font-semibold text-sm border border-white/10">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {fullName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {isAdmin ? "Administrador" : "Usuario"}
            </p>
          </div>
          <User size={14} className="text-slate-500" />
        </Link>

        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          {loadingLogout ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
