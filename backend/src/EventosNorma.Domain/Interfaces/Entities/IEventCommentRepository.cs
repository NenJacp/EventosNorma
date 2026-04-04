using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IEventCommentRepository
{
    Task<EventComment?> GetByIdAsync(int id);
    Task<IEnumerable<EventComment>> GetByEventIdAsync(int eventId);
    Task AddAsync(EventComment comment);
    Task UpdateAsync(EventComment comment);
    Task SaveChangesAsync();
}
