using System.Security.Claims;
using EventosNorma.Application.Features.Users.Queries;
using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace EventosNorma.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserHandler
{
    public async Task<CurrentUserViewModel> Handle(GetCurrentUserQuery query, IUserRepository userRepository, IHttpContextAccessor httpContextAccessor)
    {
        var httpContext = httpContextAccessor.HttpContext;
        var userIdClaim = httpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? httpContext?.User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token inválido: no se pudo obtener el ID del usuario.");
        }

        var user = await userRepository.GetByIdAsync(userId);

        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("Usuario no encontrado o inactivo.");
        }

        return new CurrentUserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
