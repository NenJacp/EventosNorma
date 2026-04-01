using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class UpdateEventHandler
{
    public async Task<bool> Handle(UpdateEventCommand command, IEventRepository repository, ICurrentUserService currentUserService)
    {
        var @event = await repository.GetByIdAsync(command.Id);
        if (@event == null) return false;

        // Validar que solo el creador o un admin pueda editar
        if (@event.CreatedById != currentUserService.UserId && !currentUserService.IsAdmin)
        {
            throw new UnauthorizedAccessException("No tiene permiso para editar este evento.");
        }

        @event.ChangeInfo(command.Title, command.Description, command.LocationDetail, command.StartDate, command.EndDate);
        
        if (command.CityId.HasValue) @event.ChangeCity(command.CityId.Value);
        if (command.EventCategoryId.HasValue) @event.ChangeCategory(command.EventCategoryId.Value);
        if (command.EventTypeId.HasValue) @event.ChangeType(command.EventTypeId.Value);
        if (command.IsPrivate.HasValue) @event.ChangePrivacy(command.IsPrivate.Value);
        if (command.MaxCapacity.HasValue) @event.ChangeCapacity(command.MaxCapacity.Value);
        if (command.Status.HasValue) @event.ChangeStatus(command.Status.Value);
        
        if (command.IsActive.HasValue)
        {
            if (command.IsActive.Value) @event.Activate(); else @event.Deactivate();
        }

        await repository.UpdateAsync(@event);
        await repository.SaveChangesAsync();
        return true;
    }
}
