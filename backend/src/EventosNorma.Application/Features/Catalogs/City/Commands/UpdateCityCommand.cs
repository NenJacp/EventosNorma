namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public record UpdateCityCommand(int Id, string Name, string? Code, int StateId, bool IsActive);
