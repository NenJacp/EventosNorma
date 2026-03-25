namespace EventosNorma.Application.Features.Users.Commands;

public record RegisterUserCommand(string FirstName, string LastName, string Email, string Password);
