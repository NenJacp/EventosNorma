using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Users.Queries;

public class GetAllUsersHandler
{
    public async Task<IEnumerable<UserViewModel>> Handle(GetAllUsersQuery query, IUserRepository userRepository)
    {
        var users = await userRepository.GetAllAsync();
        // Solo devolvemos los que están activos
        return users
            .Where(u => u.IsActive)
            .Select(u => new UserViewModel(u.Id, u.FirstName, u.LastName, u.Email))
            .ToList();
    }
}
