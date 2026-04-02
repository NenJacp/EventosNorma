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
        // Si no es admin, forzar IsActive = true
        bool? isActiveFilter = currentUserService.IsAdmin ? query.IsActive : true;

        var (items, totalCount) = await eventRepository.GetPagedAsync(
            query.PageNumber,
            query.PageSize,
            query.Title,
            query.CityId,
            query.StateId,
            query.CountryId,
            query.EventCategoryId,
            query.EventTypeId,
            query.CreatedById,
            query.ExcludeCreatedById,
            query.JoinedByUserId,
            query.StartDate,
            query.EndDate,
            query.MinCreatedAt,
            query.OnlyAvailable,
            isActiveFilter,
            query.SortBy,
            query.IsAscending);

        var viewModels = items.Select(e => new EventViewModel(
            e.Id,
            e.Title,
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
            e.IsPrivate,
            e.IsActive));

        return new PagedList<EventViewModel>(
            viewModels,
            totalCount,
            query.PageNumber,
            query.PageSize);
    }
}
