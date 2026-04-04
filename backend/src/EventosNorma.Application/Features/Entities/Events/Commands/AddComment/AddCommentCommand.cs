namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record AddCommentCommand(int EventId, string Content);
