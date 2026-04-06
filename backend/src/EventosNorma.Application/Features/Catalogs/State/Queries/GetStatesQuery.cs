using EventosNorma.Application.Features.Catalogs.State.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.State.Queries;

public record GetStatesQuery();

public class GetStatesHandler
{
    public async Task<IEnumerable<StateViewModel>> Handle(GetStatesQuery query, IStateRepository repository)
    {
        var items = await repository.GetAllAsync();
        return items.Select(s => new StateViewModel(s.Id, s.Name, s.Code, s.CountryId, s.IsActive));
    }
}
