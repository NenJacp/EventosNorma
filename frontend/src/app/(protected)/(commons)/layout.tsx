"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import UserSidebar from "@/components/UserSidebar";
import { apiFetch } from "@/lib/api";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profileImage?: string;
}

export default function CommonsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiFetch<UserData>("/api/Users/currentUser");
        setIsAdmin(user.role === "Admin");
      } catch {
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {isAdmin ? (
        <AdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          visible={sidebarVisible}
        />
      ) : (
        <UserSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          visible={sidebarVisible}
        />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] text-white md:hidden shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#0f172a] text-white hidden md:flex shadow-md hover:bg-[#1e293b] transition-colors"
      >
        {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      <main className={`flex-1 p-6 md:p-10 transition-all duration-200 ${sidebarVisible ? "md:ml-64" : "md:ml-0"}`}>
        {children}
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
