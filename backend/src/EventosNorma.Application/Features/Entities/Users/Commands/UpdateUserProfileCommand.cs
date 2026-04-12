using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record UpdateUserProfileCommand(int UserId, string? FirstName, string? LastName);

public class UpdateUserProfileHandler
{
    public async Task<bool> Handle(UpdateUserProfileCommand command, IUserRepository userRepository, ICurrentUserService currentUserService)
    {
        var currentUserId = currentUserService.UserId;
        if (currentUserId == null || currentUserId != command.UserId)
            throw new UnauthorizedAccessException("No puedes actualizar el perfil de otro usuario.");

        var user = await userRepository.GetByIdAsync(command.UserId);
        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado.");

        user.ChangeInfo(command.FirstName, command.LastName);
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();

        return true;
    }
}