namespace EventosNorma.Domain.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendTemplatedEmailAsync(string to, string subject, string templateName, Dictionary<string, string> variables);
}
