using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Events.ViewModels;

public record EventViewModel(
    int Id,
    string Title,
    string Description,
    DateTime StartDate,
    DateTime EndDate,
    string LocationDetail,
    string CityName,
    string EventCategoryName,
    string EventTypeName,
    string CreatorName,
    EventStatus Status,
    int MaxCapacity,
    bool IsPrivate,
    bool IsActive);
