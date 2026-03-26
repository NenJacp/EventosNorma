using EventosNorma.Application.Features.Users.Queries;
using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Features.Users.Queries;

public class LoginHandler
{
    public async Task<LoginViewModel> Handle(LoginQuery query, AppDbContext context, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == query.Email && u.IsActive);
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("El usuario no existe o está inactivo.");
        }

        if (!passwordHasher.Verify(query.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Contraseña incorrecta.");
        }

        var token = jwtProvider.Generate(user);

        return new LoginViewModel(user.Id, user.FirstName, user.LastName, user.Email, token);
    }
}
