using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Users.Commands;

public record UpdateUserProfileImageCommand(int UserId, Stream FileStream, string FileName);

public class UpdateUserProfileImageHandler
{
    public async Task<string> Handle(UpdateUserProfileImageCommand command, IUserRepository userRepository, IFileService fileService, ICurrentUserService currentUserService)
    {
        var currentUserId = currentUserService.UserId;
        if (currentUserId == null || currentUserId != command.UserId)
            throw new UnauthorizedAccessException("No puedes actualizar el perfil de otro usuario.");

        var user = await userRepository.GetByIdAsync(command.UserId);
        if (user == null)
            throw new KeyNotFoundException("Usuario no encontrado.");

        var imageUrl = await fileService.SaveFileAsync(command.FileStream, command.FileName, "users");
        
        // Eliminar la imagen anterior si no es la por defecto
        if (!string.IsNullOrEmpty(user.ProfileImageUrl) && user.ProfileImageUrl != "/uploads/users/defaultprofile.png")
        {
            fileService.DeleteFile(user.ProfileImageUrl);
        }

        user.UpdateProfileImage(imageUrl);
        await userRepository.UpdateAsync(user);
        await userRepository.SaveChangesAsync();

        return imageUrl;
    }
}
