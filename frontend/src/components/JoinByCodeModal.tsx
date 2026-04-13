"use client";

import { useState, useEffect } from "react";
import { Lock, X, AlertCircle } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import type { EventViewModel } from "@/types/events";

interface JoinByCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug?: string;
  onSuccess: (event: EventViewModel) => void;
}

export default function JoinByCodeModal({
  isOpen,
  onClose,
  slug,
  onSuccess,
}: JoinByCodeModalProps) {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setAccessCode("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      let event: EventViewModel;

      if (slug) {
        event = await apiFetch<EventViewModel>(
          `/api/events/slug/${slug}?code=${accessCode.trim().toUpperCase()}`
        );
      } else {
        event = await apiFetch<EventViewModel>(
          `/api/events/by-code/${accessCode.trim().toUpperCase()}`
        );
      }

      onSuccess(event);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Código de acceso incorrecto");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAccessCode("");
    setError("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Evento privado</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <p className="text-slate-600 mb-4">
          Ingresa el código de acceso que te proporcionó el creador del evento para ver {slug ? "sus detalles" : "el evento"}.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Código de acceso"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center font-mono text-lg tracking-widest uppercase"
              maxLength={8}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!accessCode.trim() || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </form>
      </div>
    </div>
  );
}
