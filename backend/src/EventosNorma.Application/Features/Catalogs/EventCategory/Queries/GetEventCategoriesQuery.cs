using EventosNorma.Application.Features.Catalogs.EventCategory.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Queries;

public record GetEventCategoriesQuery;

public class GetEventCategoriesHandler
{
    public async Task<IEnumerable<EventCategoryViewModel>> Handle(GetEventCategoriesQuery query, IEventCategoryRepository repository)
    {
        var items = await repository.GetAllAsync();
        return items.Select(x => new EventCategoryViewModel(x.Id, x.Name, x.Description, x.IsActive));
    }
}
