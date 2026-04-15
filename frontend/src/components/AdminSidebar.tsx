"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Calendar,
  Globe,
  MapPin,
  Tag,
  List,
  Users,
  Shield
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profileImage?: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  visible: boolean;
}

const adminMenuSections = [
  {
    title: "GESTIÓN",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/all-events", label: "Eventos", icon: Calendar },
      { href: "/users", label: "Usuarios", icon: Users },
    ],
  },
  {
    title: "CATÁLOGOS",
    items: [
      { href: "/catalog/countries", label: "Países", icon: Globe },
      { href: "/catalog/states", label: "Estados", icon: MapPin },
      { href: "/catalog/cities", label: "Ciudades", icon: MapPin },
      { href: "/catalog/event-types", label: "Tipos de Evento", icon: Tag },
      { href: "/catalog/event-categories", label: "Categorías", icon: List },
    ],
  },
];

export default function AdminSidebar({ isOpen, onToggle, visible }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
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
        
        if (res.role !== "Admin") {
          router.push("/home");
          return;
        }
        
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

  const userEmail = user?.email ?? "";
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || userEmail || "Admin";
  const initials =
    (user?.firstName?.[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || "?") +
    (user?.lastName?.[0]?.toUpperCase() || "");

  return (
    <aside
      className={`
      fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-400 transform transition-transform duration-200 z-40 flex flex-col
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      ${visible ? "md:translate-x-0" : "md:-translate-x-full"}
    `}
    >
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <Shield size={20} className="text-amber-500" />
        <span className="font-semibold text-white tracking-wide">
          Admin Panel
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {adminMenuSections.map((section) => (
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
                          ? "bg-[#1e293b] text-white relative before:absolute before:left-[-12px] before:top-0 before:bottom-0 before:w-1 before:bg-amber-500"
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

      <div className="border-t border-white/5 p-4 bg-[#0b1121]">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-2 mb-4 hover:bg-white/5 rounded-lg p-1 -mx-1 transition-colors"
        >
          {user?.profileImage && user.profileImage.trim() ? (
            <img src={user.profileImage} alt="Foto de perfil" className="w-10 h-10 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {fullName}
            </p>
            <p className="text-[11px] text-amber-400 truncate">
              Administrador
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          {loadingLogout ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
