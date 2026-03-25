using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Users.Commands;

public class DeleteUserHandler
{
    public async Task Handle(DeleteUserCommand command, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        var user = await userRepository.GetByIdAsync(command.Id);
        if (user == null || !user.IsActive)
        {
            throw new KeyNotFoundException("User not found or already inactive");
        }

        user.IsActive = false; // Soft Delete
        await unitOfWork.SaveChangesAsync();
    }
}
