namespace EventosNorma.Domain.Associations;

using EventosNorma.Domain.Entities;

public class EventMember
{
    // 1. Identidad
    public int Id { get; private set; }

    // 2. Estado Lógico
    public DateTime? ExitedAt { get; private set; }
    public bool IsBanned { get; private set; } = false;
    public DateTime? BannedAt { get; private set; }

    // 3. Relaciones / FKs
    public int EventId { get; private set; }
    public int UserId { get; private set; }

    // 4. Auditoría
    public DateTime JoinedAt { get; private set; }

    // 5. Navegación
    public Event Event { get; private set; } = null!;
    public User User { get; private set; } = null!;

    // --- Constructor ---
    private EventMember() { }

    // --- Fábrica (Factory) ---
    public static EventMember Create(int eventId, int userId)
    {
        if (eventId <= 0) throw new ArgumentException("El ID del evento no es válido");
        if (userId <= 0) throw new ArgumentException("El ID del usuario no es válido");

        return new EventMember
        {
            EventId = eventId,
            UserId = userId,
            JoinedAt = DateTime.UtcNow,
            IsBanned = false
        };
    }

    // --- Métodos de Cambio de Estado ---
    public void Exit()
    {
        ExitedAt = DateTime.UtcNow;
    }

    public void Ban()
    {
        if (IsBanned) return;
        IsBanned = true;
        BannedAt = DateTime.UtcNow;
        ExitedAt = DateTime.UtcNow;
    }

    public void Unban()
    {
        if (!IsBanned) return;
        IsBanned = false;
        BannedAt = null;
    }
}
