using EventosNorma.Application.Features.Users.Queries;
using EventosNorma.Application.Features.Users.ViewModels;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Features.Users.Queries;

public class GetAllUsersHandler
{
    public async Task<IEnumerable<UserViewModel>> Handle(GetAllUsersQuery query, AppDbContext context)
    {
        return await context.Users
            .Where(u => u.IsActive)
            .Select(u => new UserViewModel(u.Id, u.FirstName, u.LastName, u.Email))
            .ToListAsync();
    }
}
