using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Commands;

public class UpdateEventCategoryHandler
{
    public async Task<bool> Handle(UpdateEventCategoryCommand command, IEventCategoryRepository repository)
    {
        var category = await repository.GetByIdAsync(command.Id);
        if (category == null) return false;

        category.ChangeInfo(command.Name, command.Description);
        if (command.IsActive) category.Activate(); else category.Deactivate();

        await repository.UpdateAsync(category);
        await repository.SaveChangesAsync();
        return true;
    }
}
