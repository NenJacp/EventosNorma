using FluentValidation;
namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;
public class UpdateEventTypeValidator : AbstractValidator<UpdateEventTypeCommand>
{
    public UpdateEventTypeValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(100);
    }
}
