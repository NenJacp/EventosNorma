namespace EventosNorma.Domain.Interfaces;

public interface IFileService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folder);
    void DeleteFile(string filePath);
}
