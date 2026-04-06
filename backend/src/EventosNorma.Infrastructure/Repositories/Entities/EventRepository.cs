using EventosNorma.Domain.Entities;
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
            .Include(e => e.City)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .Include(e => e.Creator)
            .Include(e => e.Members)
            .FirstOrDefaultAsync(e => e.Id == id);
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
        bool isAscending = true)
    {
        var query = _context.Events
            .Include(e => e.City)
            .Include(e => e.EventCategory)
            .Include(e => e.EventType)
            .Include(e => e.Creator)
            .Include(e => e.Members)
            .AsQueryable();

        // 0. Privacidad y Access Code
        // Si se provee AccessCode, se busca ignorando si es privado.
        // Si NO se provee, la aplicación decide antes de llamar a este repositorio,
        // pero podemos agregar la capa de seguridad de que los privados no se muestran a menos que:
        // a) El caller haya enviado explícitamente accessCode.
        // b) El query indique incluir privados por otra forma. Como no lo sabemos aquí puramente en el repositorio sin romper la abstracción,
        // confiaremos en que la aplicación mandará solo eventos pertinentes o que en un rediseño agregamos currentUserService aquí.
        // Para simplificar, si no trae AccessCode, por ahora no filtramos IsPrivate porque el Admin necesita verlos.
        // Si se envía AccessCode, debe hacer match:
        if (!string.IsNullOrWhiteSpace(accessCode))
        {
            query = query.Where(e => e.AccessCode == accessCode);
        }

        // 1. Filtrado por Estado Activo
        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        // 2. Búsqueda por título
        if (!string.IsNullOrWhiteSpace(title))
        {
            var lowerSearch = title.ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(lowerSearch));
        }

        // 3. Filtrado por Geografía
        if (cityId.HasValue) query = query.Where(e => e.CityId == cityId.Value);
        if (stateId.HasValue) query = query.Where(e => e.City.StateId == stateId.Value);
        if (countryId.HasValue) query = query.Where(e => e.City.State.CountryId == countryId.Value);

        // 4. Filtrado por Categoría y Tipo
        if (eventCategoryId.HasValue) query = query.Where(e => e.EventCategoryId == eventCategoryId.Value);
        if (eventTypeId.HasValue) query = query.Where(e => e.EventTypeId == eventTypeId.Value);

        // 5. Filtrado por Creador / Participante
        if (createdById.HasValue) query = query.Where(e => e.CreatedById == createdById.Value);
        if (excludeCreatedById.HasValue) query = query.Where(e => e.CreatedById != excludeCreatedById.Value);
        
        if (joinedByUserId.HasValue)
        {
            query = query.Where(e => e.Members.Any(m => m.UserId == joinedByUserId.Value && m.ExitedAt == null));
        }

        // 6. Rango de Fechas del Evento
        if (startDate.HasValue) query = query.Where(e => e.StartDate >= startDate.Value);
        if (endDate.HasValue) query = query.Where(e => e.EndDate <= endDate.Value);

        // 7. Fecha de Creación
        if (minCreatedAt.HasValue) query = query.Where(e => e.CreatedAt >= minCreatedAt.Value);

        // 8. Disponibilidad
        if (onlyAvailable.HasValue && onlyAvailable.Value)
        {
            query = query.Where(e => e.Members.Count(m => m.ExitedAt == null) < e.MaxCapacity);
        }

        // 9. Ordenamiento Dinámico
        query = ApplySorting(query, sortBy, isAscending);

        // 10. Total de elementos antes de paginar
        var totalCount = await query.CountAsync();

        // 11. Paginación y ejecución
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
}
