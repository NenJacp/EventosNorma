using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class EventCommentRepository : IEventCommentRepository
{
    private readonly AppDbContext _context;

    public EventCommentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EventComment?> GetByIdAsync(int id)
    {
        return await _context.EventComments.FindAsync(id);
    }

    public async Task<IEnumerable<EventComment>> GetByEventIdAsync(int eventId)
    {
        return await _context.EventComments
            .Include(c => c.User)
            .Where(c => c.EventId == eventId && c.IsActive)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(EventComment comment)
    {
        await _context.EventComments.AddAsync(comment);
    }

    public async Task UpdateAsync(EventComment comment)
    {
        _context.EventComments.Update(comment);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
