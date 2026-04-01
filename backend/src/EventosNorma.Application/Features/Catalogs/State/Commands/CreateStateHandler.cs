using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public class CreateStateHandler
{
    public async Task<int> Handle(CreateStateCommand command, IStateRepository repository)
    {
        var state = global::EventosNorma.Domain.Catalogs.State.Create(command.Name, command.Code, command.CountryId);
        await repository.AddAsync(state);
        await repository.SaveChangesAsync();
        return state.Id;
    }
}
