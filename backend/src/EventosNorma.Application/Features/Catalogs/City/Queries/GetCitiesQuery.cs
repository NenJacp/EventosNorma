using EventosNorma.Application.Features.Catalogs.City.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.City.Queries;

public record GetCitiesQuery();

public class GetCitiesHandler
{
    public async Task<IEnumerable<CityViewModel>> Handle(GetCitiesQuery query, ICityRepository repository)
    {
        var items = await repository.GetAllAsync();
        return items.Select(c => new CityViewModel(c.Id, c.Name, c.Code, c.StateId, c.IsActive));
    }
}
