using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class VerifyPasswordCodeHandler
{
    public async Task<bool> Handle(
        VerifyPasswordCodeCommand command, 
        IUserRepository userRepository, 
        IUserTokenRepository tokenRepository)
    {
        var user = await userRepository.GetByEmailAsync(command.Email);
        if (user == null || !user.IsActive)
            throw new InvalidOperationException("Usuario no encontrado o inactivo.");

        var code = await tokenRepository.GetByCodeAsync(command.Code, UserTokenType.PasswordReset);
        
        if (code == null || !code.IsActive || code.UserId != user.Id)
            throw new InvalidOperationException("Código de verificación inválido.");

        if (code.IsExpired)
            throw new InvalidOperationException("El código de verificación ha expirado.");

        return true;
    }
}