using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Commands;

public class CreateEventCategoryHandler
{
    public async Task<int> Handle(CreateEventCategoryCommand command, IEventCategoryRepository repository)
    {
        var category = global::EventosNorma.Domain.Catalogs.EventCategory.Create(command.Name, command.Description);
        await repository.AddAsync(category);
        await repository.SaveChangesAsync();
        return category.Id;
    }
}
