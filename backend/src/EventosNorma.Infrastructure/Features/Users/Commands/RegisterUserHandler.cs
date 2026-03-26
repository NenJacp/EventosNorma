using EventosNorma.Application.Features.Users.Commands;
using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Domain.Entities;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Features.Users.Commands;

public class RegisterUserHandler
{
    public async Task<UserViewModel> Handle(RegisterUserCommand command, AppDbContext context, IPasswordHasher passwordHasher)
    {
        var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == command.Email);
        if (existingUser != null)
        {
            throw new EventosNorma.Domain.Exceptions.UserAlreadyExistsException(command.Email);
        }

        var user = User.Create(
            command.FirstName,
            command.LastName,
            command.Email,
            passwordHasher.Hash(command.Password)
        );

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        return new UserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
