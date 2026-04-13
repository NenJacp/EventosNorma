using EventosNorma.Domain.Associations;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class JoinEventHandler
{
    public async Task<bool> Handle(
        JoinEventCommand command, 
        IEventRepository eventRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");

        if (@event.Status == Domain.Enums.EventStatus.Cancelled)
        {
            throw new InvalidOperationException("No puedes unirte a un evento cancelado.");
        }

        if (!@event.IsActive)
        {
            throw new InvalidOperationException("Este evento no está disponible.");
        }

        if (@event.CreatedById == userId)
        {
            throw new InvalidOperationException("No puedes suscribirte a un evento creado por ti mismo.");
        }

        var isBanned = @event.Members.Any(m => m.UserId == userId && m.IsBanned);
        if (isBanned)
        {
            throw new InvalidOperationException("Has sido baneado de este evento y no puedes unirte.");
        }

        var alreadyMember = @event.Members.Any(m => m.UserId == userId && m.ExitedAt == null);
        if (alreadyMember) return true;

        var activeMembers = @event.Members.Count(m => m.ExitedAt == null);
        if (activeMembers >= @event.MaxCapacity)
        {
            throw new InvalidOperationException("El evento ha alcanzado su capacidad máxima.");
        }

        var member = EventMember.Create(command.EventId, userId);
        @event.Members.Add(member);
        
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();
        
        return true;
    }
}
