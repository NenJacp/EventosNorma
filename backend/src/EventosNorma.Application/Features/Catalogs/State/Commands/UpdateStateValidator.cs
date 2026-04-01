using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.State.Commands;

public class UpdateStateValidator : AbstractValidator<UpdateStateCommand>
{
    public UpdateStateValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.CountryId).GreaterThan(0);
        RuleFor(x => x.Code).MaximumLength(10);
    }
}
