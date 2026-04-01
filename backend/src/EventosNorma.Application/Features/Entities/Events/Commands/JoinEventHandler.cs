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

        // REGLA DE NEGOCIO: No puedes unirte a tu propio evento
        if (@event.CreatedById == userId)
        {
            throw new InvalidOperationException("No puedes suscribirte a un evento creado por ti mismo.");
        }

        // Verificar si ya está unido
        var alreadyMember = @event.Members.Any(m => m.UserId == userId && m.ExitedAt == null);
        if (alreadyMember) return true;

        // Verificar capacidad
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
