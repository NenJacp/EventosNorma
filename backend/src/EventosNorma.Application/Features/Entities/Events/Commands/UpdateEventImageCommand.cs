using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record UpdateEventImageCommand(int EventId, Stream FileStream, string FileName);

public class UpdateEventImageHandler
{
    public async Task<string> Handle(UpdateEventImageCommand command, IEventRepository eventRepository, IFileService fileService, ICurrentUserService currentUserService)
    {
        var @event = await eventRepository.GetByIdAsync(command.EventId);
        if (@event == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        var currentUserId = currentUserService.UserId;
        if (currentUserId == null || currentUserId != @event.CreatedById)
            throw new UnauthorizedAccessException("Solo el creador del evento puede actualizar la imagen.");

        var imageUrl = await fileService.SaveFileAsync(command.FileStream, command.FileName, "events");

        // Eliminar la imagen anterior
        if (!string.IsNullOrEmpty(@event.ImageUrl))
        {
            fileService.DeleteFile(@event.ImageUrl);
        }

        @event.UpdateImage(imageUrl);
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();

        return imageUrl;
    }
}
