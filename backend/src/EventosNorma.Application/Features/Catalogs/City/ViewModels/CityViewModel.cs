namespace EventosNorma.Application.Features.Catalogs.City.ViewModels;

public record CityViewModel(int Id, string Name, string Code, int StateId, string StateName, string CountryName, bool IsActive);
