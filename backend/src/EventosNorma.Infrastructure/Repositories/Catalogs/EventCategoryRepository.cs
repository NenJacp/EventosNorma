using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class EventCategoryRepository : IEventCategoryRepository
{
    private readonly AppDbContext _context;

    public EventCategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EventCategory?> GetByIdAsync(int id)
    {
        return await _context.EventCategories.FindAsync(id);
    }

    public async Task<IEnumerable<EventCategory>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.EventCategories.AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(c => c.IsActive);
        }
        return await query.ToListAsync();
    }

    public async Task AddAsync(EventCategory category)
    {
        await _context.EventCategories.AddAsync(category);
    }

    public async Task UpdateAsync(EventCategory category)
    {
        _context.EventCategories.Update(category);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
