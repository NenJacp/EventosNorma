using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.City.Commands;

public class CreateCityValidator : AbstractValidator<CreateCityCommand>
{
    public CreateCityValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.StateId).GreaterThan(0);
        RuleFor(x => x.Code).MaximumLength(10);
    }
}
