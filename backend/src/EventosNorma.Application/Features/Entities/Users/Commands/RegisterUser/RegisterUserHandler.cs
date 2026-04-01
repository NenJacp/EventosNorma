using EventosNorma.Application.Features.Entities.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Entities;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class RegisterUserHandler
{
    public async Task<UserViewModel> Handle(RegisterUserCommand command, IUserRepository userRepository, IPasswordHasher passwordHasher)
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
        await userRepository.SaveChangesAsync();

        return new UserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
