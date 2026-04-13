using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class CreateEventResponse
{
    public int Id { get; set; }
    public string Slug { get; set; } = "";
    public string? AccessCode { get; set; }
    public bool IsPrivate { get; set; }
}

public class CreateEventHandler
{
    public async Task<CreateEventResponse> Handle(CreateEventCommand command, IEventRepository repository, ICurrentUserService currentUserService)
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
            command.MaxCapacity,
            false,
            command.ImageUrl);

        await repository.AddAsync(@event);
        await repository.SaveChangesAsync();

        return new CreateEventResponse
        {
            Id = @event.Id,
            Slug = @event.Slug,
            AccessCode = @event.AccessCode,
            IsPrivate = @event.IsPrivate
        };
    }
}
