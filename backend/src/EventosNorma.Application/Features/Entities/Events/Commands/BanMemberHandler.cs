namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class BanMemberHandler
{
    public async Task<bool> Handle(
        BanMemberCommand command, 
        IEventRepository eventRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");

        if (@event.CreatedById != userId && !currentUserService.IsAdmin)
        {
            throw new UnauthorizedAccessException("Solo el creador del evento o un administrador puede banear miembros.");
        }

        if (command.UserId == @event.CreatedById)
        {
            throw new InvalidOperationException("No puedes banear al creador del evento.");
        }

        var member = @event.Members.FirstOrDefault(m => m.UserId == command.UserId && m.ExitedAt == null);
        if (member == null)
        {
            throw new KeyNotFoundException("El usuario no es miembro activo de este evento.");
        }

        member.Ban();
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();
        
        return true;
    }
}
