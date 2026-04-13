using EventosNorma.Application.Common.Models;
using EventosNorma.Application.Features.Entities.Events.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public class GetEventsPagedHandler
{
    public async Task<PagedList<EventViewModel>> Handle(
        GetEventsPagedQuery query, 
        IEventRepository eventRepository,
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? 0;
        
        bool? isActiveFilter = currentUserService.IsAdmin ? query.IsActive : true;

        int? excludeCreatedById = query.ExcludeCreatedById;
        if (!currentUserService.IsAdmin && query.CreatedById == null && query.JoinedByUserId == null)
        {
            excludeCreatedById = currentUserService.UserId;
        }

        bool includePrivate = currentUserService.IsAdmin 
            || query.CreatedById.HasValue 
            || query.JoinedByUserId.HasValue;

        var (items, totalCount) = await eventRepository.GetPagedAsync(
            query.PageNumber,
            query.PageSize,
            includePrivate,
            query.Title,
            query.CityId,
            query.StateId,
            query.CountryId,
            query.EventCategoryId,
            query.EventTypeId,
            query.CreatedById,
            excludeCreatedById,
            query.JoinedByUserId,
            query.StartDate,
            query.EndDate,
            query.MinCreatedAt,
            query.OnlyAvailable,
            isActiveFilter,
            query.AccessCode,
            query.SortBy,
            query.IsAscending);

        var filteredItems = items.AsEnumerable();

        if (query.ExcludeJoinedEvents == true && userId > 0)
        {
            filteredItems = filteredItems.Where(e => 
                !e.Members.Any(m => m.UserId == userId && m.ExitedAt == null));
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLowerInvariant();
            filteredItems = filteredItems.Where(e =>
                e.Title.ToLowerInvariant().Contains(searchLower) ||
                e.Description.ToLowerInvariant().Contains(searchLower));
        }

        var viewModels = filteredItems.Select(e => {
            var isMember = e.Members.Any(m => m.UserId == userId && m.ExitedAt == null);
            var isCreator = e.CreatedById == userId;
            var showAccessCode = currentUserService.IsAdmin || isCreator || isMember || query.AccessCode == e.AccessCode;
            return new EventViewModel(
                e.Id,
                e.Title,
                e.Slug,
                e.Description,
                e.StartDate,
                e.EndDate,
                e.LocationDetail,
                e.City.Name,
                e.EventCategory.Name,
                e.EventType.Name,
                $"{e.Creator.FirstName} {e.Creator.LastName}",
                e.Status,
                e.MaxCapacity,
                e.Members.Count(m => m.JoinedAt != null && m.ExitedAt == null),
                e.IsPrivate,
                showAccessCode ? e.AccessCode : null,
                e.IsActive,
                e.ImageUrl,
                isCreator,
                isMember);
        });

        return new PagedList<EventViewModel>(
            viewModels,
            filteredItems.Count(),
            query.PageNumber,
            query.PageSize);
    }
}
