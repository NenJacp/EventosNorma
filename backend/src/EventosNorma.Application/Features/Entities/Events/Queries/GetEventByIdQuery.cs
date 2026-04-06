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
            throw new UnauthorizedAccessException("Este evento es privado. Debes unirte mediante código de acceso para verlo.");

        return new EventViewModel(
            e.Id,
            e.Title,
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
            e.IsPrivate,
            // Solo admin, creador o miembro ven el AccessCode
            (currentUserService.IsAdmin || e.CreatedById == currentUserService.UserId || e.Members.Any(m => m.UserId == currentUserService.UserId && m.ExitedAt == null)) ? e.AccessCode : null,
            e.IsActive);
    }
}
