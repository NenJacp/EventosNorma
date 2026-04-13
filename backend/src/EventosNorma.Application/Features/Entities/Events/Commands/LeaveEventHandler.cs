namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class LeaveEventHandler
{
    public async Task<bool> Handle(
        LeaveEventCommand command, 
        IEventRepository eventRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");

        var membership = @event.Members.FirstOrDefault(m => m.UserId == userId && m.ExitedAt == null);
        
        if (membership == null)
        {
            throw new InvalidOperationException("No estás inscrito en este evento.");
        }

        if (@event.CreatedById == userId)
        {
            throw new InvalidOperationException("El creador no puede abandonar el evento. Considera eliminarlo o transferirlo.");
        }

        membership.Exit();
        
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();
        
        return true;
    }
}
