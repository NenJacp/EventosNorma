namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public record UpdateCountryCommand(int Id, string Name, string? Code, bool IsActive);
