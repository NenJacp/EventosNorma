using EventosNorma.Application.Common.Helpers;
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

        if (@event.CreatedById != currentUserService.UserId && !currentUserService.IsAdmin)
        {
            throw new UnauthorizedAccessException("No tiene permiso para editar este evento.");
        }

        string? newSlug = null;
        if (!string.IsNullOrWhiteSpace(command.Title) && command.Title.Trim() != @event.Title)
        {
            newSlug = await SlugHelper.GenerateUniqueSlugAsync(command.Title, repository, @event.Id);
        }
        
        @event.ChangeInfo(command.Title, command.Description, command.LocationDetail, command.StartDate, command.EndDate, newSlug);
        
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
