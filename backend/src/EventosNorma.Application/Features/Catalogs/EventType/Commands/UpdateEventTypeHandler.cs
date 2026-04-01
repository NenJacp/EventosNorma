using EventosNorma.Domain.Interfaces;
namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;
public class UpdateEventTypeHandler
{
    public async Task<bool> Handle(UpdateEventTypeCommand command, IEventTypeRepository repository)
    {
        var type = await repository.GetByIdAsync(command.Id);
        if (type == null) return false;
        type.ChangeInfo(command.Name, command.Description);
        if (command.IsActive) type.Activate(); else type.Deactivate();
        await repository.UpdateAsync(type);
        await repository.SaveChangesAsync();
        return true;
    }
}
