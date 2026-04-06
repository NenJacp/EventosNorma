using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record ForgotPasswordCommand(string Email);

public class ForgotPasswordHandler
{
    public async Task<bool> Handle(ForgotPasswordCommand command, IUserRepository userRepository, IUserTokenRepository tokenRepository, IEmailService emailService)
    {
        var user = await userRepository.GetByEmailAsync(command.Email);
        
        // Para evitar ataques de enumeración de usuarios, siempre retornamos "éxito"
        if (user == null || !user.IsActive)
            return true;

        var tokenString = Guid.NewGuid().ToString("N");
        var token = UserToken.Create(user.Id, tokenString, UserTokenType.PasswordReset, 1); // 1 hora de expiración
        
        await tokenRepository.AddAsync(token);
        await tokenRepository.SaveChangesAsync();

        var resetUrl = $"http://localhost:3000/reset-password?token={tokenString}&email={command.Email}";
        
        var message = $"Hola {user.FirstName}, has solicitado restablecer tu contraseña.\n\n" +
                      $"Haz clic en el siguiente enlace para crear una nueva contraseña:\n{resetUrl}\n\n" +
                      "Si no fuiste tú, puedes ignorar este mensaje de forma segura.";
        
        await emailService.SendEmailAsync(user.Email, "Restablecer contraseña", message);
        
        return true;
    }
}
