using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public class CreateCountryHandler
{
    public async Task<int> Handle(CreateCountryCommand command, ICountryRepository repository)
    {
        var country = global::EventosNorma.Domain.Catalogs.Country.Create(command.Name, command.Code);
        await repository.AddAsync(country);
        await repository.SaveChangesAsync();
        return country.Id;
    }
}
