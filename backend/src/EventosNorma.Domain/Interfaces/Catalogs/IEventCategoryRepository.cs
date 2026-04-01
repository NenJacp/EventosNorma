using EventosNorma.Domain.Catalogs;

namespace EventosNorma.Domain.Interfaces;

public interface IEventCategoryRepository
{
    Task<EventCategory?> GetByIdAsync(int id);
    Task<IEnumerable<EventCategory>> GetAllAsync(bool includeInactive = false);
    Task AddAsync(EventCategory category);
    Task UpdateAsync(EventCategory category);
    Task SaveChangesAsync();
}
