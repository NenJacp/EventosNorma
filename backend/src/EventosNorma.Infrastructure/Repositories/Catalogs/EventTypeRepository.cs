using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class EventTypeRepository : IEventTypeRepository
{
    private readonly AppDbContext _context;

    public EventTypeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EventType?> GetByIdAsync(int id)
    {
        return await _context.EventTypes.FindAsync(id);
    }

    public async Task<IEnumerable<EventType>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.EventTypes.AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(t => t.IsActive);
        }
        return await query.ToListAsync();
    }

    public async Task AddAsync(EventType type)
    {
        await _context.EventTypes.AddAsync(type);
    }

    public async Task UpdateAsync(EventType type)
    {
        _context.EventTypes.Update(type);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
