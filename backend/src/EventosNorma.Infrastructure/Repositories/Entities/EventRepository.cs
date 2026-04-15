using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EventosNorma.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;

    public EventRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(int id)
    {
        return await _context.Events
            .Include(e => e.City).ThenInclude(c => c.State).ThenInclude(s => s.Country)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .Include(e => e.Creator)
            .Include(e => e.Members).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Event?> GetBySlugAsync(string slug)
    {
        return await _context.Events
            .Include(e => e.City).ThenInclude(c => c.State).ThenInclude(s => s.Country)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .Include(e => e.Creator)
            .Include(e => e.Members).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(e => e.Slug == slug);
    }

    public async Task<IEnumerable<Event>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.Events
            .Include(e => e.City)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(e => e.IsActive);
        }

        return await query.ToListAsync();
    }

    public async Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
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
        bool isAscending = true)
    {
        var query = _context.Events
            .Include(e => e.City).ThenInclude(c => c.State).ThenInclude(s => s.Country)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .Include(e => e.Creator)
            .Include(e => e.Members)
            .ThenInclude(m => m.User)
            .AsQueryable();

        // 0. Privacidad y Access Code
        if (string.IsNullOrWhiteSpace(accessCode) && !includePrivate)
        {
            query = query.Where(e => !e.IsPrivate);
        }

        if (!string.IsNullOrWhiteSpace(accessCode))
        {
            query = query.Where(e => e.AccessCode == accessCode);
        }

        // 1. Filtrado por Estado Activo
        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        // 2. Filtrado por Status del Evento
        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        // 3. Búsqueda por título
        if (!string.IsNullOrWhiteSpace(title))
        {
            var lowerSearch = title.ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(lowerSearch));
        }

        // 4. Filtrado por Geografía
        if (cityId.HasValue) query = query.Where(e => e.CityId == cityId.Value);
        if (stateId.HasValue) query = query.Where(e => e.City.StateId == stateId.Value);
        if (countryId.HasValue) query = query.Where(e => e.City.State.CountryId == countryId.Value);

        // 5. Filtrado por Categoría y Tipo
        if (eventCategoryId.HasValue) query = query.Where(e => e.EventCategoryId == eventCategoryId.Value);
        if (eventTypeId.HasValue) query = query.Where(e => e.EventTypeId == eventTypeId.Value);

        // 6. Filtrado por Creador / Participante
        if (createdById.HasValue) query = query.Where(e => e.CreatedById == createdById.Value);
        if (excludeCreatedById.HasValue) query = query.Where(e => e.CreatedById != excludeCreatedById.Value);
        
        if (joinedByUserId.HasValue)
        {
            query = query.Where(e => e.Members.Any(m => m.UserId == joinedByUserId.Value && m.ExitedAt == null));
        }

        // 7. Rango de Fechas del Evento
        if (startDate.HasValue) query = query.Where(e => e.StartDate >= startDate.Value);
        if (endDate.HasValue) query = query.Where(e => e.EndDate <= endDate.Value);

        // 8. Fecha de Creación
        if (minCreatedAt.HasValue) query = query.Where(e => e.CreatedAt >= minCreatedAt.Value);

        // 9. Disponibilidad
        if (onlyAvailable.HasValue && onlyAvailable.Value)
        {
            query = query.Where(e => e.Members.Count(m => m.ExitedAt == null) < e.MaxCapacity);
        }

        // 10. Ordenamiento Dinámico
        query = ApplySorting(query, sortBy, isAscending);

        // 11. Total de elementos antes de paginar
        var totalCount = await query.CountAsync();

        // 12. Paginación y ejecución
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    private static IQueryable<Event> ApplySorting(IQueryable<Event> query, string? sortBy, bool isAscending)
    {
        Expression<Func<Event, object>> keySelector = sortBy?.ToLower() switch
        {
            "title" => e => e.Title,
            "startdate" => e => e.StartDate,
            "enddate" => e => e.EndDate,
            "capacity" => e => e.MaxCapacity,
            "createdat" => e => e.CreatedAt,
            _ => e => e.StartDate // Orden por defecto
        };

        return isAscending ? query.OrderBy(keySelector) : query.OrderByDescending(keySelector);
    }

    public async Task AddAsync(Event @event)
    {
        await _context.Events.AddAsync(@event);
    }

    public async Task UpdateAsync(Event @event)
    {
        _context.Events.Update(@event);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsSlugUniqueAsync(string slug, int? excludeEventId = null)
    {
        var query = _context.Events.Where(e => e.Slug == slug);
        if (excludeEventId.HasValue)
        {
            query = query.Where(e => e.Id != excludeEventId.Value);
        }
        return !await query.AnyAsync();
    }
}
