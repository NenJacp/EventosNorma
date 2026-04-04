namespace EventosNorma.Application.Features.Entities.Events.Commands;

public class AddCommentHandler
{
    public async Task<int> Handle(
        AddCommentCommand command, 
        IEventCommentRepository commentRepository, 
        ICurrentUserService currentUserService)
    {
        var userId = currentUserService.UserId ?? throw new UnauthorizedAccessException();

        var comment = EventComment.Create(userId, command.EventId, command.Content);

        await commentRepository.AddAsync(comment);
        await commentRepository.SaveChangesAsync();

        return comment.Id;
    }
}
