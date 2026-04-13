"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Mobile toggle */}
      <button
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0f172a] text-white md:hidden shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop sidebar toggle button */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#0f172a] text-white hidden md:flex shadow-md hover:bg-[#1e293b] transition-colors"
        title={sidebarVisible ? "Ocultar sidebar" : "Mostrar sidebar"}
      >
        {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isOpen} 
        onToggle={handleToggle} 
        visible={sidebarVisible} 
      />

      {/* Main content */}
      <main className={`flex-1 p-6 md:p-10 transition-all duration-200 ${sidebarVisible ? "md:ml-64" : "md:ml-0"}`}>
        {children}
      </main>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
