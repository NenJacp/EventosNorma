using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public class ToggleStateHandler
{
    public async Task<bool> Handle(ToggleStateCommand command, IStateRepository stateRepository)
    {
        var state = await stateRepository.GetByIdAsync(command.Id);
        if (state == null) return false;

        if (state.IsActive)
            state.Deactivate();
        else
            state.Activate();

        await stateRepository.UpdateAsync(state);
        await stateRepository.SaveChangesAsync();
        return true;
    }
}
