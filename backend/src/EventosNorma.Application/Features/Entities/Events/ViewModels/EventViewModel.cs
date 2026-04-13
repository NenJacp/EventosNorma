using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Events.ViewModels;

public record EventViewModel(
    int Id,
    string Title,
    string Slug,
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
    int CurrentCapacity,
    bool IsPrivate,
    string? AccessCode,
    bool IsActive,
    string? ImageUrl,
    bool IsCreator,
    bool IsMember,
    bool ShowJoinButton = false)
{
    public bool IsFull => MaxCapacity > 0 && CurrentCapacity >= MaxCapacity;
    public int AvailableSlots => MaxCapacity - CurrentCapacity;
    public string DisplayImageUrl => ImageUrl ?? Event.DefaultEventImage;
}
