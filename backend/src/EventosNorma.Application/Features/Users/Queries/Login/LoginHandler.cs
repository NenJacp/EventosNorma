using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Application.Interfaces;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Users.Queries;

public class LoginHandler
{
    public async Task<UserViewModel?> Handle(LoginQuery query, IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        var user = await userRepository.GetByEmailAsync(query.Email);
        if (user == null || !passwordHasher.Verify(query.Password, user.PasswordHash))
        {
            return null;
        }

        return new UserViewModel(user.Id, user.FirstName, user.LastName, user.Email);
    }
}
