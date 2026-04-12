using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class ResendVerificationHandler
{
    public async Task Handle(
        ResendVerificationCommand command,
        IUserRepository userRepository,
        IUserTokenRepository tokenRepository,
        IEmailService emailService)
    {
        var user = await userRepository.GetByEmailAsync(command.Email);
        
        if (user == null)
        {
            throw new InvalidOperationException("Usuario no encontrado.");
        }

        if (user.EmailVerified)
        {
            throw new InvalidOperationException("El correo ya está verificado.");
        }

        var code = new Random().Next(10000000, 99999999).ToString();
        var token = UserToken.Create(user.Id, code, UserTokenType.EmailVerification);
        
        await tokenRepository.AddAsync(token);
        await tokenRepository.SaveChangesAsync();

        await emailService.SendTemplatedEmailAsync(
            user.Email,
            "Nuevo código de verificación - EventosNorma",
            "VerifyEmail",
            new Dictionary<string, string>
            {
                { "nombre", user.FirstName },
                { "codigo", code },
                { "expiracion", "24 horas" }
            }
        );
    }
}