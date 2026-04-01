using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public class UpdateCountryHandler
{
    public async Task<bool> Handle(UpdateCountryCommand command, ICountryRepository repository)
    {
        var country = await repository.GetByIdAsync(command.Id);
        if (country == null) return false;

        country.ChangeInfo(command.Name, command.Code);
        if (command.IsActive) country.Activate(); else country.Deactivate();

        await repository.UpdateAsync(country);
        await repository.SaveChangesAsync();
        return true;
    }
}
