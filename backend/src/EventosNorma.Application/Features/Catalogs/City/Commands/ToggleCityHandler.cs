using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public class ToggleCityHandler
{
    public async Task<bool> Handle(ToggleCityCommand command, ICityRepository cityRepository)
    {
        var city = await cityRepository.GetByIdAsync(command.Id);
        if (city == null) return false;

        if (city.IsActive)
            city.Deactivate();
        else
            city.Activate();

        await cityRepository.UpdateAsync(city);
        await cityRepository.SaveChangesAsync();
        return true;
    }
}
