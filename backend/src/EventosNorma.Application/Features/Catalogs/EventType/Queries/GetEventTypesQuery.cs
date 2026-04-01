using EventosNorma.Application.Features.Catalogs.EventType.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventType.Queries;

public record GetEventTypesQuery;

public class GetEventTypesHandler
{
    public async Task<IEnumerable<EventTypeViewModel>> Handle(GetEventTypesQuery query, IEventTypeRepository repository)
    {
        var items = await repository.GetAllAsync();
        return items.Select(x => new EventTypeViewModel(x.Id, x.Name, x.Description, x.IsActive));
    }
}
