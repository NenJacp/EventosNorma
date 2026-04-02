using EventosNorma.Domain.Associations;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Repositories;

public class EventMemberRepository : IEventMemberRepository
{
    private readonly AppDbContext _context;

    public EventMemberRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EventMember?> GetByIdAsync(int id)
    {
        return await _context.EventMembers
            .Include(m => m.Event)
                .ThenInclude(e => e!.City)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventCategory)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventType)
            .Include(m => m.Event)
                .ThenInclude(e => e!.Creator)
            .Include(m => m.User)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<EventMember?> GetByEventAndUserAsync(int eventId, int userId)
    {
        return await _context.EventMembers
            .FirstOrDefaultAsync(m => m.EventId == eventId && m.UserId == userId);
    }

    public async Task<IEnumerable<EventMember>> GetByUserIdAsync(int userId, bool includeExited = false)
    {
        var query = _context.EventMembers
            .Include(m => m.Event)
                .ThenInclude(e => e!.City)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventCategory)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventType)
            .Include(m => m.Event)
                .ThenInclude(e => e!.Creator)
            .Include(m => m.User)
            .Where(m => m.UserId == userId);

        if (!includeExited)
        {
            query = query.Where(m => m.ExitedAt == null);
        }

        return await query.OrderByDescending(m => m.JoinedAt).ToListAsync();
    }

    public async Task<(IEnumerable<EventMember> Items, int TotalCount)> GetPagedByUserIdAsync(
        int userId,
        int pageNumber,
        int pageSize,
        bool includeExited = false)
    {
        var query = _context.EventMembers
            .Include(m => m.Event)
                .ThenInclude(e => e!.City)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventCategory)
            .Include(m => m.Event)
                .ThenInclude(e => e!.EventType)
            .Include(m => m.Event)
                .ThenInclude(e => e!.Creator)
            .Include(m => m.User)
            .Where(m => m.UserId == userId);

        if (!includeExited)
        {
            query = query.Where(m => m.ExitedAt == null);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(m => m.JoinedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(EventMember member)
    {
        await _context.EventMembers.AddAsync(member);
    }

    public async Task UpdateAsync(EventMember member)
    {
        _context.EventMembers.Update(member);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}