using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public class UpdateCityValidator : AbstractValidator<UpdateCityCommand>
{
    public UpdateCityValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.StateId).GreaterThan(0);
        RuleFor(x => x.Code).MaximumLength(10);
    }
}
