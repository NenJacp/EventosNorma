namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record BanUserCommand(int UserId, string? Reason);
