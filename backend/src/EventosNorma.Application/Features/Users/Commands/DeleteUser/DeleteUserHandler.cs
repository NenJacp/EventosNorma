using EventosNorma.Application.Features.Users.Commands;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Users.Commands.DeleteUser;

public class DeleteUserHandler
{
    public async Task Handle(DeleteUserCommand command, IUserRepository userRepository)
    {
        var user = await userRepository.GetByIdAsync(command.Id);

        if (user == null)
        {
            throw new KeyNotFoundException($"Usuario con ID {command.Id} no encontrado.");
        }

        user.Deactivate();
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
    }
}
