using EventosNorma.Application.Common.Models;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetEventsPagedQuery : PaginationParams
{
    public string? Title { get; init; }
    public string? Search { get; init; }
    public int? CityId { get; init; }
    public int? StateId { get; init; }
    public int? CountryId { get; init; }
    public int? EventCategoryId { get; init; }
    public int? EventTypeId { get; init; }
    public int? CreatedById { get; init; }
    public int? ExcludeCreatedById { get; init; }
    public int? JoinedByUserId { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public DateTime? MinCreatedAt { get; init; }
    public bool? OnlyAvailable { get; init; }
    public bool? IsActive { get; init; }
    public string? AccessCode { get; init; }
    public bool? ExcludeJoinedEvents { get; init; }
    public EventStatus? Status { get; init; }
    public bool? IncludeInactive { get; init; }
}
