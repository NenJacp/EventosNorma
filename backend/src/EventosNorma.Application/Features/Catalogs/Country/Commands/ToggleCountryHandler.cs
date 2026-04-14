using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public class ToggleCountryHandler
{
    public async Task<bool> Handle(ToggleCountryCommand command, ICountryRepository countryRepository)
    {
        var country = await countryRepository.GetByIdAsync(command.Id);
        if (country == null) return false;

        if (country.IsActive)
            country.Deactivate();
        else
            country.Activate();

        await countryRepository.UpdateAsync(country);
        await countryRepository.SaveChangesAsync();
        return true;
    }
}
