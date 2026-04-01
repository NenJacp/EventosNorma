using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.Country.Commands;

public class UpdateCountryValidator : AbstractValidator<UpdateCountryCommand>
{
    public UpdateCountryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.Code).MaximumLength(10);
    }
}
