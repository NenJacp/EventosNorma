using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public class UnbanUserHandler
{
    public async Task<bool> Handle(UnbanUserCommand command, IUserRepository userRepository)
    {
        var user = await userRepository.GetByIdAsync(command!.UserId);
        
        if (user == null)
            return false;
            
        if (!user.IsBanned)
            return true;
            
        user.Unban();
        user.Activate();
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();
        
        return true;
    }
}
