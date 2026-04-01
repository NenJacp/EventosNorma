namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public record CreateStateCommand(string Name, string? Code, int CountryId);
