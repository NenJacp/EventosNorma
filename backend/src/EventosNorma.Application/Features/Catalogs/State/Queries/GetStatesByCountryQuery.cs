using EventosNorma.Application.Features.Catalogs.State.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.State.Queries;

public record GetStatesByCountryQuery(int CountryId);

public class GetStatesByCountryHandler
{
    public async Task<IEnumerable<StateViewModel>> Handle(GetStatesByCountryQuery query, IStateRepository repository)
    {
        var items = await repository.GetByCountryIdAsync(query.CountryId);
        return items.Select(x => new StateViewModel(x.Id, x.Name, x.Code ?? string.Empty, x.CountryId, x.IsActive));
    }
}
