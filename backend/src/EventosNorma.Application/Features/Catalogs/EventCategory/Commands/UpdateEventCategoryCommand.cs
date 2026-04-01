namespace EventosNorma.Application.Features.Catalogs.EventCategory.Commands;

public record UpdateEventCategoryCommand(int Id, string Name, string? Description, bool IsActive);
