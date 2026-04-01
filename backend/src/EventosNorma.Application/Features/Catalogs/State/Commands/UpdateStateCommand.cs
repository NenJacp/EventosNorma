namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public record UpdateStateCommand(int Id, string Name, string? Code, int CountryId, bool IsActive);
