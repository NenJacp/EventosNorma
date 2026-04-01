using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Commands;

public class UpdateEventCategoryValidator : AbstractValidator<UpdateEventCategoryCommand>
{
    public UpdateEventCategoryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es requerido.")
            .MinimumLength(3).WithMessage("El nombre debe tener al menos 3 caracteres.")
            .MaximumLength(100).WithMessage("El nombre no debe exceder los 100 caracteres.");
            
        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("La descripción no debe exceder los 500 caracteres.");
    }
}
