using EventosNorma.Domain.Entities;

namespace EventosNorma.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task<IEnumerable<Event>> GetAllAsync(bool includeInactive = false);
    Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? title = null,
        int? cityId = null,
        int? stateId = null,
        int? countryId = null,
        int? eventCategoryId = null,
        int? eventTypeId = null,
        int? createdById = null,
        int? excludeCreatedById = null,
        int? joinedByUserId = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        DateTime? minCreatedAt = null,
        bool? onlyAvailable = null,
        bool? isActive = null,
        string? accessCode = null,
        string? sortBy = null,
        bool isAscending = true);
    Task AddAsync(Event @event);
    Task UpdateAsync(Event @event);
    Task SaveChangesAsync();
}
