using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class BanUserHandler
{
    public async Task<bool> Handle(BanUserCommand command, IUserRepository userRepository)
    {
        var user = await userRepository.GetByIdAsync(command!.UserId);
        
        if (user == null)
            return false;
            
        if (user.Role.ToString() == "Admin")
            throw new InvalidOperationException("No se puede banear a un administrador.");
            
        if (user.IsBanned)
            return true;
            
        user.Ban(command.Reason);
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        
        return true;
    }
}
