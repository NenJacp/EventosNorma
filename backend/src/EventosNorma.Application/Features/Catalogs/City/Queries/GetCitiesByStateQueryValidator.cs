using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.City.Queries;

public class GetCitiesByStateQueryValidator : AbstractValidator<GetCitiesByStateQuery>
{
    public GetCitiesByStateQueryValidator()
    {
        RuleFor(x => x.StateId).GreaterThan(0);
    }
}
