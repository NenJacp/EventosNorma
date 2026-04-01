using FluentValidation;
namespace EventosNorma.Application.Features.Catalogs.EventType.Commands;
public class CreateEventTypeValidator : AbstractValidator<CreateEventTypeCommand>
{
    public CreateEventTypeValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(100);
    }
}
