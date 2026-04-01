namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public record CreateCityCommand(string Name, string? Code, int StateId);
