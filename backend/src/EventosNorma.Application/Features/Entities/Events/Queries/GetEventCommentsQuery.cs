using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Queries;

public record GetEventCommentsQuery(int EventId);

public record CommentViewModel(
    int Id,
    string Content,
    string UserName,
    string? UserProfileImage,
    bool IsEdited,
    DateTime CreatedAt,
    int? ParentCommentId,
    bool IsActive);

public class GetEventCommentsHandler
{
    public async Task<IEnumerable<CommentViewModel>> Handle(GetEventCommentsQuery query, IEventCommentRepository commentRepository, ICurrentUserService currentUserService)
    {
        // En una implementación real más limpia, pasaríamos esta lógica al repositorio o usaríamos Specifications.
        var comments = await commentRepository.GetByEventIdAsync(query.EventId);

        // Si no es admin, solo devolver comentarios activos
        if (!currentUserService.IsAdmin)
        {
            comments = comments.Where(c => c.IsActive);
        }

        return comments.Select(c => new CommentViewModel(
            c.Id,
            c.IsActive ? c.Content : "Este comentario ha sido eliminado.", // Ocultar contenido si no está activo, incluso para admin (o puedes decidir mostrárselo al admin). Para este caso lo ocultamos.
            $"{c.User.FirstName} {c.User.LastName}",
            c.User.ProfileImageUrl,
            c.IsEdited,
            c.CreatedAt,
            c.ParentCommentId,
            c.IsActive
        )).OrderBy(c => c.CreatedAt).ToList();
    }
}