using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record UpdateEventCommand(
    int Id,
    string? Title,
    string? Description,
    string? LocationDetail,
    DateTime? StartDate,
    DateTime? EndDate,
    int? CityId,
    int? EventCategoryId,
    int? EventTypeId,
    bool? IsPrivate,
    int? MaxCapacity,
    EventStatus? Status,
    bool? IsActive);
