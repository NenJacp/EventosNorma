using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class VerifyEmailHandler
{
    public async Task<bool> Handle(
        VerifyEmailCommand command, 
        IUserRepository userRepository, 
        IUserTokenRepository tokenRepository)
    {
        var code = await tokenRepository.GetByCodeAsync(command.Code, UserTokenType.EmailVerification);

        if (code == null || code.User.Email != command.Email)
        {
            throw new InvalidOperationException("Código de verificación inválido.");
        }

        if (code.IsExpired)
        {
            throw new InvalidOperationException("El código de verificación ha expirado.");
        }

        var user = code.User;
        user.VerifyEmail();
        code.Use();

        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        await tokenRepository.SaveChangesAsync();

        return true;
    }
}
