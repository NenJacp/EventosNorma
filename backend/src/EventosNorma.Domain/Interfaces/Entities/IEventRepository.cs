using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task<Event?> GetBySlugAsync(string slug);
    Task<IEnumerable<Event>> GetAllAsync(bool includeInactive = false);
    Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        bool includePrivate = false,
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
        EventStatus? status = null,
        string? accessCode = null,
        string? sortBy = null,
        bool isAscending = true);
    Task AddAsync(Event @event);
    Task UpdateAsync(Event @event);
    Task SaveChangesAsync();
    Task<bool> IsSlugUniqueAsync(string slug, int? excludeEventId = null);
}
