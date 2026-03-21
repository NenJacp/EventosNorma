namespace EventosNorma.Application.DTOs;

public record UserRegisterRequest(string FirstName, string LastName, string Email, string Password);
public record UserLoginRequest(string Email, string Password);
public record UserResponse(int Id, string FirstName, string LastName, string Email);
