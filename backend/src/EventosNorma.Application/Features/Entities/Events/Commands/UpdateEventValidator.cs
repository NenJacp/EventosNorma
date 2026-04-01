using FluentValidation;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class UpdateEventValidator : AbstractValidator<UpdateEventCommand>
{
    public UpdateEventValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).MinimumLength(5).MaximumLength(200).When(x => x.Title != null);
        RuleFor(x => x.MaxCapacity).GreaterThan(0).When(x => x.MaxCapacity.HasValue);
    }
}
