namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;
public record UpdateEventTypeCommand(int Id, string Name, string? Description, bool IsActive);
