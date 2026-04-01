using EventosNorma.Application.Features.Entities.Users.Queries;
using EventosNorma.Application.Features.Entities.Users.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Queries;

public class GetAllUsersHandler
{
    public async Task<IEnumerable<UserViewModel>> Handle(GetAllUsersQuery query, IUserRepository userRepository)
    {
        var users = await userRepository.GetAllAsync();
        return users.Select(u => new UserViewModel(u.Id, u.FirstName, u.LastName, u.Email));
    }
}
