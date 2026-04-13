namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class UnbanMemberHandler
{
    public async Task<bool> Handle(
        UnbanMemberCommand command, 
        IEventRepository eventRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();
        var @event = await eventRepository.GetByIdAsync(command.EventId);

        if (@event == null) throw new KeyNotFoundException("Evento no encontrado");

        if (@event.CreatedById != userId && !currentUserService.IsAdmin)
        {
            throw new UnauthorizedAccessException("Solo el creador del evento o un administrador puede desbanear miembros.");
        }

        var member = @event.Members.FirstOrDefault(m => m.UserId == command.UserId && m.IsBanned);
        if (member == null)
        {
            throw new KeyNotFoundException("El usuario no está baneado de este evento.");
        }

        member.Unban();
        await eventRepository.UpdateAsync(@event);
        await eventRepository.SaveChangesAsync();
        
        return true;
    }
}
