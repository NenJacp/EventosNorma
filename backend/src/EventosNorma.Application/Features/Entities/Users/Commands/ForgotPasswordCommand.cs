using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Exceptions;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record ForgotPasswordCommand(string Email);

public class ForgotPasswordHandler
{
    public async Task<bool> Handle(ForgotPasswordCommand command, IUserRepository userRepository, IUserTokenRepository tokenRepository, IEmailService emailService)
    {
        var user = await userRepository.GetByEmailAsync(command.Email);
        
        if (user == null || !user.IsActive)
            throw new UserNotFoundException(command.Email);

        var code = new Random().Next(10000000, 99999999).ToString();
        var token = UserToken.Create(user.Id, code, UserTokenType.PasswordReset, 1);
        
        await tokenRepository.AddAsync(token);
        await tokenRepository.SaveChangesAsync();

        var body = $"<h1>Hola {user.FirstName}</h1><p>Tu código de verificación es: <b>{code}</b></p><p>Este código expira en 1 hora.</p>";
        
        await emailService.SendEmailAsync(user.Email, "Restablecer contraseña - EventosNorma", body);
        
        return true;
    }
}
