using EventosNorma.Domain.Associations;

namespace EventosNorma.Domain.Interfaces;

public interface IEventMemberRepository
{
    Task<EventMember?> GetByIdAsync(int id);
    Task<EventMember?> GetByEventAndUserAsync(int eventId, int userId);
    Task<IEnumerable<EventMember>> GetByUserIdAsync(int userId, bool includeExited = false);
    Task<(IEnumerable<EventMember> Items, int TotalCount)> GetPagedByUserIdAsync(
        int userId,
        int pageNumber,
        int pageSize,
        bool includeExited = false);
    Task AddAsync(EventMember member);
    Task UpdateAsync(EventMember member);
    Task SaveChangesAsync();
}