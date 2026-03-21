using EventosNorma.Application.DTOs;
using EventosNorma.Application.Interfaces;
using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserResponse> RegisterAsync(UserRegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new Exception("User already exists");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password)
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return new UserResponse(user.Id, user.FirstName, user.LastName, user.Email);
    }

    public async Task<UserResponse?> LoginAsync(UserLoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return new UserResponse(user.Id, user.FirstName, user.LastName, user.Email);
    }

    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserResponse(u.Id, u.FirstName, u.LastName, u.Email));
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        _userRepository.Delete(user);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
