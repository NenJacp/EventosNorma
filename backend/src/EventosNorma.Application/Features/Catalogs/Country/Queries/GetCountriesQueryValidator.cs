using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.Country.Queries;

public class GetCountriesQueryValidator : AbstractValidator<GetCountriesQuery>
{
    public GetCountriesQueryValidator()
    {
    }
}
