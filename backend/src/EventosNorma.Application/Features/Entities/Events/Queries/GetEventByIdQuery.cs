using EventosNorma.Application.Features.Entities.Events.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetEventByIdQuery(int Id);

public class GetEventByIdHandler
{
    public async Task<EventViewModel> Handle(GetEventByIdQuery query, IEventRepository eventRepository, ICurrentUserService currentUserService)
    {
        var e = await eventRepository.GetByIdAsync(query.Id);

        if (e == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        // Regla de Visibilidad: 
        // Si el evento está inactivo y NO es Admin, devolver error
        if (!e.IsActive && !currentUserService.IsAdmin)
            throw new UnauthorizedAccessException("El evento no está disponible.");

        // Si es privado y NO es admin, NO es el creador, y NO es miembro: ocultar.
        if (e.IsPrivate && !currentUserService.IsAdmin && e.CreatedById != currentUserService.UserId && !e.Members.Any(m => m.UserId == currentUserService.UserId && m.ExitedAt == null))
            throw new UnauthorizedAccessException("Este evento es privado. Solicita el código de acceso al creador del evento.");

        var userId = currentUserService.UserId ?? 0;
        var isMember = e.Members.Any(m => m.UserId == userId && m.ExitedAt == null);

        return new EventViewModel(
            e.Id,
            e.Title,
            e.Slug,
            e.Description,
            e.StartDate,
            e.EndDate,
            e.LocationDetail,
            e.City.Name,
            e.EventCategory.Name,
            e.EventType.Name,
            $"{e.Creator.FirstName} {e.Creator.LastName}",
            e.Status,
            e.MaxCapacity,
            e.Members.Count(m => m.JoinedAt != null && m.ExitedAt == null),
            e.IsPrivate,
            (currentUserService.IsAdmin || e.CreatedById == userId || isMember) ? e.AccessCode : null,
            e.IsActive,
            e.ImageUrl,
            e.CreatedById == userId,
            isMember);
    }
}
