using EventosNorma.Application.Features.Entities.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Enums;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class RegisterUserHandler
{
    public async Task<UserViewModel> Handle(
        RegisterUserCommand command, 
        IUserRepository userRepository, 
        IUserTokenRepository tokenRepository,
        IPasswordHasher passwordHasher,
        IEmailService emailService)
    {
        // Verificar que el correo no exista
        var existingUser = await userRepository.GetByEmailAsync(command.Email);
        if (existingUser != null) throw new EventosNorma.Domain.Exceptions.UserAlreadyExistsException(command.Email);

        User user = User.Create(
            command.FirstName,
            command.LastName,
            command.Email,
            passwordHasher.Hash(command.Password)
        );

        await userRepository.AddAsync(user);
        await userRepository.SaveChangesAsync(); // Guardamos para tener el ID del usuario

        // Generar Token de Verificación (ejemplo simple de 6 caracteres)
        var code = new Random().Next(10000000, 99999999).ToString();
        var token = UserToken.Create(user.Id, code, UserTokenType.EmailVerification);
        
        await tokenRepository.AddAsync(token);
        await tokenRepository.SaveChangesAsync();

        // Enviar Correo
        await emailService.SendTemplatedEmailAsync(
            user.Email,
            "Verifica tu cuenta - EventosNorma",
            "VerifyEmail",
            new Dictionary<string, string>
            {
                { "nombre", user.FirstName },
                { "codigo", code },
                { "expiracion", "24 horas" }
            }
        );

        return new UserViewModel(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role.ToString(),
            user.IsBanned,
            user.BanReason,
            user.BannedAt,
            user.IsActive,
            user.CreatedAt
        );
    }
}
