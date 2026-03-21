using EventosNorma.Application.DTOs;

namespace EventosNorma.Application.Interfaces;

public interface IUserService
{
    Task<UserResponse> RegisterAsync(UserRegisterRequest request);
    Task<UserResponse?> LoginAsync(UserLoginRequest request);
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
    Task<bool> DeleteUserAsync(int id);
}
