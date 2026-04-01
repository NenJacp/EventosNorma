using EventosNorma.Application.Features.Entities.Users.Queries;
using EventosNorma.Application.Features.Entities.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace EventosNorma.Application.Features.Entities.Users.Queries;

public class LoginHandler
{
    public async Task<LoginViewModel> Handle(LoginQuery query, IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, IHttpContextAccessor httpContextAccessor)
    {
        var user = await userRepository.GetByEmailAsync(query.Email);

        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("El usuario no existe o está inactivo.");
        }

        if (!passwordHasher.Verify(query.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Contraseña incorrecta.");
        }

        var token = jwtProvider.Generate(user);

        // Configurar la Cookie
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, 
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddHours(2)
        };

        httpContextAccessor.HttpContext?.Response.Cookies.Append("jwt", token, cookieOptions);

        return new LoginViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
