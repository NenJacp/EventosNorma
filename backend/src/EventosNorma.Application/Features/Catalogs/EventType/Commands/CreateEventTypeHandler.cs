using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;
namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;
public class CreateEventTypeHandler
{
    public async Task<int> Handle(CreateEventTypeCommand command, IEventTypeRepository repository)
    {
        var type = global::EventosNorma.Domain.Catalogs.EventType.Create(command.Name, command.Description);
        await repository.AddAsync(type);
        await repository.SaveChangesAsync();
        return type.Id;
    }
}
