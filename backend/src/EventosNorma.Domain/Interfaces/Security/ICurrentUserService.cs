using EventosNorma.Domain.Enums;

namespace EventosNorma.Domain.Interfaces;

public interface ICurrentUserService
{
    int? UserId { get; }
    string? Email { get; }
    UserRole? Role { get; }
    bool IsAdmin { get; }
}
