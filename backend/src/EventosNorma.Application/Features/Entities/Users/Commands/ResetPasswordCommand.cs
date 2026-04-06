using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record ResetPasswordCommand(string Email, string Token, string NewPassword);

public class ResetPasswordHandler
{
    public async Task<bool> Handle(ResetPasswordCommand command, IUserRepository userRepository, IUserTokenRepository tokenRepository, IPasswordHasher passwordHasher)
    {
        var user = await userRepository.GetByEmailAsync(command.Email);
        if (user == null || !user.IsActive)
            throw new ArgumentException("El enlace de restablecimiento es inválido o ha expirado.");

        var token = await tokenRepository.GetByTokenAsync(command.Token, UserTokenType.PasswordReset);
        
        if (token == null || !token.IsActive || token.UserId != user.Id)
            throw new ArgumentException("El enlace de restablecimiento es inválido o ha expirado.");

        var newHash = passwordHasher.Hash(command.NewPassword);
        user.ChangePassword(newHash);
        
        token.Use();
        
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync(); 
        
        return true;
    }
}
