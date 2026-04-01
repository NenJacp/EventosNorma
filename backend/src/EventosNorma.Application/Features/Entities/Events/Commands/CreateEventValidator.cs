using FluentValidation;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class CreateEventValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MinimumLength(5).MaximumLength(200);
        RuleFor(x => x.StartDate).NotEmpty().LessThan(x => x.EndDate);
        RuleFor(x => x.CityId).GreaterThan(0);
        RuleFor(x => x.EventCategoryId).GreaterThan(0);
        RuleFor(x => x.EventTypeId).GreaterThan(0);
        RuleFor(x => x.MaxCapacity).GreaterThan(0);
    }
}
