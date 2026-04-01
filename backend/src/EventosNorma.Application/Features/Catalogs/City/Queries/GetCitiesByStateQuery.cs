using EventosNorma.Application.Features.Catalogs.City.ViewModels;

namespace EventosNorma.Application.Features.Catalogs.City.Queries;

public record GetCitiesByStateQuery(int StateId);

public class GetCitiesByStateHandler
{
    public async Task<IEnumerable<CityViewModel>> Handle(GetCitiesByStateQuery query, ICityRepository repository)
    {
        var items = await repository.GetByStateIdAsync(query.StateId);
        return items.Select(x => new CityViewModel(x.Id, x.Name, x.Code ?? string.Empty, x.StateId, x.IsActive));
    }
}
