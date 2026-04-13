"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "@/lib/toast";

interface CommentViewModel {
  id: number;
  content: string;
  userName: string;
  userProfileImage: string | null;
  isEdited: boolean;
  createdAt: string;
  parentCommentId: number | null;
  isActive: boolean;
}

interface CommentsSectionProps {
  eventId: number;
  canComment: boolean;
}

export default function CommentsSection({ eventId, canComment }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<CommentViewModel[]>(`/api/events/${eventId}/comments`);
      setComments(data || []);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await apiFetch(`/api/events/${eventId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, content: newComment.trim() }),
      });
      setNewComment("");
      toast.success("Comentario publicado");
      fetchComments();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Error al publicar comentario");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    if (days < 7) return `Hace ${days} día${days !== 1 ? "s" : ""}`;
    
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-900">
          Comentarios
          <span className="ml-2 text-sm font-normal text-slate-400">({comments.length})</span>
        </h3>
      </div>

      {canComment && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={2}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
              {submitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <MessageCircle size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-slate-500 text-sm">
            {canComment ? "Sé el primero en comentar" : "No hay comentarios aún"}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                {comment.userProfileImage ? (
                  <img
                    src={comment.userProfileImage}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-medium flex-shrink-0">
                    {comment.userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{comment.userName}</span>
                    <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                    {comment.isEdited && (
                      <span className="text-[10px] text-slate-400 italic">(editado)</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
