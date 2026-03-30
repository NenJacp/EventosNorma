using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task<IEnumerable<Event>> GetAllAsync(bool includeInactive = false);
    Task AddAsync(Event @event);
    Task UpdateAsync(Event @event);
    Task SaveChangesAsync();
}
