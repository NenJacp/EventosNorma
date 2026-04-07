using EventosNorma.Domain.Entities;
using FluentValidation;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .Must(User.IsValidPasswordFormat)
            .WithMessage(User.PasswordRequirementsMessage);
    }
}
