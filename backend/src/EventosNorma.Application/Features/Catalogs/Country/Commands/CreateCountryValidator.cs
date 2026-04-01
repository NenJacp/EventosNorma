using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public class CreateCountryValidator : AbstractValidator<CreateCountryCommand>
{
    public CreateCountryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Code).MaximumLength(10);
    }
}
