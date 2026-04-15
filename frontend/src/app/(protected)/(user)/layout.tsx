"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import UserSidebar from "@/components/UserSidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      <UserSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        visible={sidebarVisible}
      />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] text-white md:hidden shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#0f172a] text-white hidden md:flex shadow-md hover:bg-[#1e293b] transition-colors"
        title={sidebarVisible ? "Ocultar sidebar" : "Mostrar sidebar"}
      >
        {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      <main 
        className={`flex-1 p-6 md:p-10 transition-all duration-200 ${sidebarVisible ? "md:ml-64" : "md:ml-0"}`}
      >
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
