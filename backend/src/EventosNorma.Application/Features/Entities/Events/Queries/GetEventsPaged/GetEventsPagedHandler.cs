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
            query.AccessCode,
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
            // Regla: Solo el creador, un miembro, o el admin pueden ver el AccessCode. O si lo buscaron específicamente por ese código.
            (currentUserService.IsAdmin || e.CreatedById == currentUserService.UserId || e.Members.Any(m => m.UserId == currentUserService.UserId && m.ExitedAt == null) || query.AccessCode == e.AccessCode) ? e.AccessCode : null,
            e.IsActive));

        return new PagedList<EventViewModel>(
            viewModels,
            totalCount,
            query.PageNumber,
            query.PageSize);
    }
}
