using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public class UpdateStateHandler
{
    public async Task<bool> Handle(UpdateStateCommand command, IStateRepository repository)
    {
        var state = await repository.GetByIdAsync(command.Id);
        if (state == null) return false;

        state.ChangeInfo(command.Name, command.Code);
        state.ChangeCountry(command.CountryId);
        if (command.IsActive) state.Activate(); else state.Deactivate();

        await repository.UpdateAsync(state);
        await repository.SaveChangesAsync();
        return true;
    }
}
