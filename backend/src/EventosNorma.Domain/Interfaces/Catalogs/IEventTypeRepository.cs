using EventosNorma.Domain.Catalogs;

namespace EventosNorma.Domain.Interfaces;

public interface IEventTypeRepository
{
    Task<EventType?> GetByIdAsync(int id);
    Task<IEnumerable<EventType>> GetAllAsync(bool includeInactive = false);
    Task AddAsync(EventType type);
    Task UpdateAsync(EventType type);
    Task SaveChangesAsync();
}
