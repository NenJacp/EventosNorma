using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.EventCategory.Queries;

public class GetEventCategoriesQueryValidator : AbstractValidator<GetEventCategoriesQuery>
{
    public GetEventCategoriesQueryValidator()
    {
    }
}
