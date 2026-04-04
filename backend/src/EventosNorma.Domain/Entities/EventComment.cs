using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Domain.Entities;

public class EventComment : IAuditableEntity
{
    public int Id { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;
    
    public int UserId { get; private set; }
    public User User { get; private set; } = null!;
    
    public int EventId { get; private set; }
    public Event Event { get; private set; } = null!;

    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private EventComment() { }

    public static EventComment Create(int userId, int eventId, string content)
    {
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("El comentario no puede estar vacío.");
        return new EventComment
        {
            UserId = userId,
            EventId = eventId,
            Content = content.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) throw new ArgumentException("El comentario no puede estar vacío.");
        Content = content.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate() => IsActive = false;
}
