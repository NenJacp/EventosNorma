namespace EventosNorma.Application.DTOs;

public record UserRegisterRequest(string Name, string Email, string Password);
public record UserLoginRequest(string Email, string Password);
public record UserResponse(Guid Id, string Name, string Email);
