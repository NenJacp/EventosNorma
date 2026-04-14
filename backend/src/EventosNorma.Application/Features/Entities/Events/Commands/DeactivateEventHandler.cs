using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class DeactivateEventHandler
{
    public async Task<bool> Handle(DeactivateEventCommand command, IEventRepository eventRepository)
    {
        var evt = await eventRepository.GetByIdAsync(command.EventId);
        if (evt == null) return false;

        evt.Deactivate();
        await eventRepository.UpdateAsync(evt);
        await eventRepository.SaveChangesAsync();
        return true;
    }
}
