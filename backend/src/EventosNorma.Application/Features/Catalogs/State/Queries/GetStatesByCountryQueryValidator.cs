using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.State.Queries;

public class GetStatesByCountryQueryValidator : AbstractValidator<GetStatesByCountryQuery>
{
    public GetStatesByCountryQueryValidator()
    {
        RuleFor(x => x.CountryId).GreaterThan(0);
    }
}
