using FluentValidation;

namespace EventosNorma.Application.Features.Catalogs.EventType.Queries;

public class GetEventTypesQueryValidator : AbstractValidator<GetEventTypesQuery>
{
    public GetEventTypesQueryValidator()
    {
    }
}
