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
        var body = $"<h1>Hola {user.FirstName}</h1><p>Tu código de verificación es: <b>{code}</b></p>";
        await emailService.SendEmailAsync(user.Email, "Verifica tu cuenta - EventosNorma", body);

        return new UserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
