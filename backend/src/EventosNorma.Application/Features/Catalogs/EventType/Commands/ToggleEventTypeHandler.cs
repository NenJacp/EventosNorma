using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;

public class ToggleEventTypeHandler
{
    public async Task<bool> Handle(ToggleEventTypeCommand command, IEventTypeRepository eventTypeRepository)
    {
        var eventType = await eventTypeRepository.GetByIdAsync(command.Id);
        if (eventType == null) return false;

        if (eventType.IsActive)
            eventType.Deactivate();
        else
            eventType.Activate();

        await eventTypeRepository.UpdateAsync(eventType);
        await eventTypeRepository.SaveChangesAsync();
        return true;
    }
}
