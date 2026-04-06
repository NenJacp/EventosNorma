using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Domain.Entities;

public class EventComment : IAuditableEntity
{
    // 1. Identidad
    public int Id { get; private set; }

    // 2. Datos
    public string Content { get; private set; } = string.Empty;

    // 3. Estado Lógico
    public bool IsActive { get; private set; } = true;
    public bool IsEdited { get; private set; } = false;
    
    // 4. Relaciones / FKs
    public int UserId { get; private set; }
    public int EventId { get; private set; }
    public int? ParentCommentId { get; private set; }

    // 5. Auditoría
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // 6. Navegación
    public User User { get; private set; } = null!;
    public Event Event { get; private set; } = null!;
    public EventComment? ParentComment { get; private set; }
    public ICollection<EventComment> Replies { get; private set; } = new List<EventComment>();

    // --- Constructor ---
    private EventComment() { }

    // --- Fábrica (Factory) ---
    public static EventComment Create(int userId, int eventId, string content, int? parentCommentId = null)
    {
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("El comentario no puede estar vacío.");
        return new EventComment
        {
            UserId = userId,
            EventId = eventId,
            Content = content.Trim(),
            ParentCommentId = parentCommentId,
            IsActive = true,
            IsEdited = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Update(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("El comentario no puede estar vacío.");
        Content = content.Trim();
        IsEdited = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() => IsActive = false;
}