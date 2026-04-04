namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record VerifyEmailCommand(string Email, string Token);
