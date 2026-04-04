using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class VerifyEmailHandler
{
    public async Task<bool> Handle(
        VerifyEmailCommand command, 
        IUserRepository userRepository, 
        IUserTokenRepository tokenRepository)
    {
        var token = await tokenRepository.GetByTokenAsync(command.Token, UserTokenType.EmailVerification);

        if (token == null || token.User.Email != command.Email)
        {
            throw new InvalidOperationException("Código de verificación inválido.");
        }

        if (token.IsExpired)
        {
            throw new InvalidOperationException("El código de verificación ha expirado.");
        }

        var user = token.User;
        user.VerifyEmail();
        token.Use();

        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        await tokenRepository.SaveChangesAsync();

        return true;
    }
}
