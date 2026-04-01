using EventosNorma.Application.Features.Catalogs.Country.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.Country.Queries;

public record GetCountriesQuery;

public class GetCountriesHandler
{
    public async Task<IEnumerable<CountryViewModel>> Handle(GetCountriesQuery query, ICountryRepository repository)
    {
        var items = await repository.GetAllAsync();
        return items.Select(x => new CountryViewModel(x.Id, x.Name, x.Code ?? string.Empty, x.IsActive));
    }
}
