using FluentValidation;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class CreateEventValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es obligatorio")
            .MinimumLength(5).WithMessage("El título debe tener al menos 5 caracteres")
            .MaximumLength(200).WithMessage("El título no puede exceder 200 caracteres");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("La fecha de inicio es obligatoria")
            .LessThan(x => x.EndDate).WithMessage("La fecha de inicio debe ser anterior a la fecha de fin");

        RuleFor(x => x.CityId)
            .GreaterThan(0).WithMessage("La ciudad es obligatoria");

        RuleFor(x => x.EventCategoryId)
            .GreaterThan(0).WithMessage("La categoría es obligatoria");

        RuleFor(x => x.EventTypeId)
            .GreaterThan(0).WithMessage("El tipo de evento es obligatorio");

        RuleFor(x => x.MaxCapacity)
            .GreaterThan(0).WithMessage("La capacidad debe ser mayor a 0");
    }
}
