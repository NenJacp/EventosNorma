namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record ReopenEventCommand(int EventId);

public class ReopenEventHandler
{
    public async Task<bool> Handle(
        ReopenEventCommand command, 
        IEventRepository eventRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");

        if (!currentUserService.IsAdmin && @event.CreatedById != userId)
        {
            throw new UnauthorizedAccessException("No tienes permisos para reabrir este evento.");
        }

        @event.ReopenEvent();
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();

        return true;
    }
}
