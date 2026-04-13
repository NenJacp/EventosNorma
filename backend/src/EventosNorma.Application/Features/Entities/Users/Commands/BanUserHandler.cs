namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class BanUserHandler
{
    public async Task<bool> Handle(
        BanUserCommand command,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        if (!currentUserService.IsAdmin)
            throw new UnauthorizedAccessException("Solo un administrador puede banear usuarios.");

        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        
        if (command.UserId == userId)
            throw new InvalidOperationException("No puedes banearte a ti mismo.");

        var user = await userRepository.GetByIdAsync(command.UserId);
        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado.");

        if (user.Role == Domain.Enums.UserRole.Admin)
            throw new InvalidOperationException("No se puede banear a un administrador.");

        user.Ban(command.Reason ?? "Baneado por un administrador.");
        
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        
        return true;
    }
}
