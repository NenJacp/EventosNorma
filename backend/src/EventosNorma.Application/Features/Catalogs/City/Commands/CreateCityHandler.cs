namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public class CreateCityHandler
{
    public async Task<int> Handle(CreateCityCommand command, ICityRepository repository)
    {
        var city = global::EventosNorma.Domain.Catalogs.City.Create(command.Name, command.Code, command.StateId);
        await repository.AddAsync(city);
        await repository.SaveChangesAsync();
        return city.Id;
    }
}
