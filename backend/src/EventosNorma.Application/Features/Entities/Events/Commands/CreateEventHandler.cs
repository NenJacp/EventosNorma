using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class CreateEventHandler
{
    public async Task<int> Handle(CreateEventCommand command, IEventRepository repository, ICurrentUserService currentUserService)
    {
        var creatorId = currentUserService.UserId ?? throw new UnauthorizedAccessException("Debe iniciar sesión para crear eventos.");

        var @event = Event.Create(
            command.Title,
            command.Description,
            command.StartDate,
            command.EndDate,
            command.LocationDetail,
            command.CityId,
            command.EventCategoryId,
            command.EventTypeId,
            command.IsPrivate,
            creatorId,
            command.MaxCapacity);

        await repository.AddAsync(@event);
        await repository.SaveChangesAsync();
        return @event.Id;
    }
}
