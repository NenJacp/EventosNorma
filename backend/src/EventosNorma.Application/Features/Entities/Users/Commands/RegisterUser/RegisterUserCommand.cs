namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record RegisterUserCommand(string FirstName, string LastName, string Email, string Password);
