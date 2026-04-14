using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class ActivateEventHandler
{
    public async Task<bool> Handle(ActivateEventCommand command, IEventRepository eventRepository)
    {
        var evt = await eventRepository.GetByIdAsync(command.EventId);
        if (evt == null) return false;

        evt.Activate();
        await eventRepository.UpdateAsync(evt);
        await eventRepository.SaveChangesAsync();
        return true;
    }
}
