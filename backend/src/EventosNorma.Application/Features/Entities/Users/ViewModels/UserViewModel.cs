namespace EventosNorma.Application.Features.Entities.Users.ViewModels;

public record UserViewModel(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    bool IsBanned,
    string? BanReason,
    DateTime? BannedAt,
    bool IsActive,
    DateTime CreatedAt
);
