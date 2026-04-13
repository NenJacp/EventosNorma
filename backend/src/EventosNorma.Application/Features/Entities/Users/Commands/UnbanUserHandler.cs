namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class UnbanUserHandler
{
    public async Task<bool> Handle(
        UnbanUserCommand command,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        if (!currentUserService.IsAdmin)
            throw new UnauthorizedAccessException("Solo un administrador puede desbanear usuarios.");

        var user = await userRepository.GetByIdAsync(command.UserId);
        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado.");

        if (!user.IsBanned)
            throw new InvalidOperationException("Este usuario no está baneado.");

        user.Unban();
        user.Activate();
        
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        
        return true;
    }
}
