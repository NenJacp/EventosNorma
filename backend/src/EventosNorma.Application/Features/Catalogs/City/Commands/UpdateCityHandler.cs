namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public class UpdateCityHandler
{
    public async Task<bool> Handle(UpdateCityCommand command, ICityRepository repository)
    {
        var city = await repository.GetByIdAsync(command.Id);
        if (city == null) return false;

        city.ChangeInfo(command.Name, command.Code);
        city.ChangeState(command.StateId);
        if (command.IsActive) city.Activate(); else city.Deactivate();

        await repository.UpdateAsync(city);
        await repository.SaveChangesAsync();
        return true;
    }
}
