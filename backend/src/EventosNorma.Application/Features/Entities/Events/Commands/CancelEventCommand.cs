using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record CancelEventCommand(int EventId);

public class CancelEventHandler
{
    public async Task<bool> Handle(CancelEventCommand command, IEventRepository eventRepository, ICurrentUserService currentUserService)
    {
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        if (!currentUserService.IsAdmin && @event.CreatedById != currentUserService.UserId)
            throw new UnauthorizedAccessException("No tienes permisos para cancelar este evento.");

        @event.CancelEvent();
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();

        return true;
    }
}