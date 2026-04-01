namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record CreateEventCommand(
    string Title,
    string? Description,
    DateTime StartDate,
    DateTime EndDate,
    string? LocationDetail,
    int CityId,
    int EventCategoryId,
    int EventTypeId,
    bool IsPrivate,
    int MaxCapacity);
