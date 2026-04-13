using EventosNorma.Application.Features.Entities.Events.ViewModels;
using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetEventBySlugQuery(string Slug, string? AccessCode = null);

public class GetEventBySlugHandler
{
    public async Task<EventViewModel> Handle(GetEventBySlugQuery query, IEventRepository eventRepository, ICurrentUserService currentUserService)
    {
        var e = await eventRepository.GetBySlugAsync(query.Slug);

        if (e == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        // Regla de Visibilidad: 
        // Si el evento está inactivo y NO es Admin, devolver error
        if (!e.IsActive && !currentUserService.IsAdmin)
            throw new UnauthorizedAccessException("El evento no está disponible.");

        var userId = currentUserService.UserId ?? 0;
        var isMember = e.Members.Any(m => m.UserId == userId && m.ExitedAt == null);
        var isCreator = e.CreatedById == userId;

        // Si es privado y NO es admin, NO es el creador, y NO es miembro
        if (e.IsPrivate && !currentUserService.IsAdmin && !isCreator && !isMember)
        {
            // Verificar si el código de acceso es correcto
            if (string.IsNullOrWhiteSpace(query.AccessCode) || query.AccessCode.ToUpper() != e.AccessCode?.ToUpper())
            {
                throw new UnauthorizedAccessException("Este evento es privado. Solicita el código de acceso al creador del evento.");
            }
        }

        var showAccessCode = currentUserService.IsAdmin || isCreator || isMember;
        var showJoinButton = e.IsPrivate && !isCreator && !isMember;

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
            showAccessCode ? e.AccessCode : null,
            e.IsActive,
            e.ImageUrl,
            isCreator,
            isMember,
            showJoinButton);
    }
}