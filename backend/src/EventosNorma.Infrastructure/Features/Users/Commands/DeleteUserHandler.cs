using EventosNorma.Application.Features.Users.Commands;
using EventosNorma.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Features.Users.Commands;

public class DeleteUserHandler
{
    public async Task Handle(DeleteUserCommand command, AppDbContext context)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == command.Id && u.IsActive);
        if (user == null)
        {
            throw new KeyNotFoundException("Usuario no encontrado o ya está inactivo.");
        }

        user.Deactivate();
        await context.SaveChangesAsync();
    }
}
