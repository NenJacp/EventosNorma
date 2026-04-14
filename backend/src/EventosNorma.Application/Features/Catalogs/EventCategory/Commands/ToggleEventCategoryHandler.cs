using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Commands;

public class ToggleEventCategoryHandler
{
    public async Task<bool> Handle(ToggleEventCategoryCommand command, IEventCategoryRepository eventCategoryRepository)
    {
        var category = await eventCategoryRepository.GetByIdAsync(command.Id);
        if (category == null) return false;

        if (category.IsActive)
            category.Deactivate();
        else
            category.Activate();

        await eventCategoryRepository.UpdateAsync(category);
        await eventCategoryRepository.SaveChangesAsync();
        return true;
    }
}
