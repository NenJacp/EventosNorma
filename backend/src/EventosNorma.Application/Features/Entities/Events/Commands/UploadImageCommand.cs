using EventosNorma.Domain.Interfaces;

namespace EventosNorma.Application.Features.Entities.Events.Commands;

public record UploadImageCommand(Stream FileStream, string FileName);

public class UploadImageHandler
{
    private readonly IFileService _fileService;

    public UploadImageHandler(IFileService fileService)
    {
        _fileService = fileService;
    }

    public async Task<string> Handle(UploadImageCommand command)
    {
        var imageUrl = await _fileService.SaveFileAsync(command.FileStream, command.FileName, "events");
        return imageUrl;
    }
}