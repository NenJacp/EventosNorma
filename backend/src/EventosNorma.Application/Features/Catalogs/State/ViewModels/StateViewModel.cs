namespace EventosNorma.Application.Features.Catalogs.State.ViewModels;

public record StateViewModel(int Id, string Name, string Code, int CountryId, string CountryName, bool IsActive);
