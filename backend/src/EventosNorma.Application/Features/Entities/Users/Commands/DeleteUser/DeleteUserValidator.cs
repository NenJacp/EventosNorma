using FluentValidation;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class DeleteUserValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
