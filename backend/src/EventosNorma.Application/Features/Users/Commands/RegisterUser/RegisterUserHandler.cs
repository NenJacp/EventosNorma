using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Application.Interfaces;
using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Users.Commands;

public class RegisterUserHandler
{
    public async Task<UserViewModel> Handle(RegisterUserCommand command, IUserRepository userRepository, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        var existingUser = await userRepository.GetByEmailAsync(command.Email);
        if (existingUser != null)
        {
            throw new EventosNorma.Domain.Exceptions.UserAlreadyExistsException(command.Email);
        }

        var user = new User
        {
            FirstName = command.FirstName,
            LastName = command.LastName,
            Email = command.Email,
            PasswordHash = passwordHasher.Hash(command.Password)
        };

        await userRepository.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return new UserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
