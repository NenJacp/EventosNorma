namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetEventMembersQuery(int EventId);

public record EventMemberViewModel(
    int Id,
    int UserId,
    string UserName,
    string? UserProfileImage,
    DateTime JoinedAt,
    bool IsBanned,
    DateTime? BannedAt,
    bool IsCreator);

public class GetEventMembersHandler
{
    public async Task<IEnumerable<EventMemberViewModel>> Handle(
        GetEventMembersQuery query, 
        IEventRepository eventRepository,
        ICurrentUserService currentUserService)
    {
        var @event = await eventRepository.GetByIdAsync(query.EventId);
        
        if (@event == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        return @event.Members
            .Where(m => m.ExitedAt == null || m.IsBanned)
            .Select(m => new EventMemberViewModel(
                m.Id,
                m.UserId,
                $"{m.User.FirstName} {m.User.LastName}",
                m.User.ProfileImageUrl,
                m.JoinedAt,
                m.IsBanned,
                m.BannedAt,
                m.UserId == @event.CreatedById
            ))
            .OrderByDescending(m => m.IsCreator)
            .ThenByDescending(m => m.IsBanned)
            .ThenBy(m => m.UserName)
            .ToList();
    }
}
