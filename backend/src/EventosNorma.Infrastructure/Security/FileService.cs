using EventosNorma.Domain.Interfaces;
using Microsoft.Extensions.Hosting;

namespace EventosNorma.Infrastructure.Security;

public class FileService : IFileService
{
    private readonly IHostEnvironment _environment;

    public FileService(IHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder)
    {
        if (fileStream == null || fileStream.Length == 0) return string.Empty;

        var contentPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var path = Path.Combine(contentPath, "uploads", folder);

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
        var filePath = Path.Combine(path, uniqueFileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await fileStream.CopyToAsync(stream);

        return $"/uploads/{folder}/{uniqueFileName}";
    }

    public void DeleteFile(string filePath)
    {
        var contentPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var fullPath = Path.Combine(contentPath, filePath.TrimStart('/'));

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }
}
