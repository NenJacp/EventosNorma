using EventosNorma.Application.Common.Models;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Associations;
using EventosNorma.Domain.Entities;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetMySubscriptionsQuery(int PageNumber = 1, int PageSize = 10) : PaginationParams;

public class GetMySubscriptionsHandler
{
    public async Task<PagedList<SubscriptionViewModel>> Handle(
        GetMySubscriptionsQuery query,
        IEventMemberRepository eventMemberRepository,
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId 
            ?? throw new UnauthorizedAccessException("No se pudo identificar al usuario");

        var (items, totalCount) = await eventMemberRepository.GetPagedByUserIdAsync(
            userId,
            query.PageNumber,
            query.PageSize);

        var viewModels = items.Select(m => new SubscriptionViewModel(
            m.Event.Id,
            m.Event.Title,
            m.Event.Slug,
            m.Event.Description,
            m.Event.StartDate,
            m.Event.EndDate,
            m.Event.LocationDetail,
            m.Event.City.Name,
            m.Event.EventCategory.Name,
            m.Event.EventType.Name,
            $"{m.Event.Creator.FirstName} {m.Event.Creator.LastName}",
            m.Event.Status,
            m.JoinedAt,
            m.Event.IsActive,
            m.Event.MaxCapacity,
            m.Event.Members.Count(mem => mem.ExitedAt == null),
            m.ExitedAt != null
        )).ToList();

        return new PagedList<SubscriptionViewModel>(
            viewModels,
            totalCount,
            query.PageNumber,
            query.PageSize);
    }
}

public record SubscriptionViewModel(
    int EventId,
    string Title,
    string Slug,
    string Description,
    DateTime StartDate,
    DateTime EndDate,
    string LocationDetail,
    string CityName,
    string CategoryName,
    string TypeName,
    string CreatorName,
    Domain.Enums.EventStatus Status,
    DateTime JoinedAt,
    bool IsActive,
    int MaxCapacity,
    int CurrentCapacity,
    bool HasExited)
{
    public bool IsFull => MaxCapacity > 0 && CurrentCapacity >= MaxCapacity;
    public int AvailableSlots => MaxCapacity - CurrentCapacity;
}