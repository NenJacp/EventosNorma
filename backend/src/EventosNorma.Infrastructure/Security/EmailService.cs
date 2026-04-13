using EventosNorma.Domain.Interfaces;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using Microsoft.Extensions.Configuration;

namespace EventosNorma.Infrastructure.Security;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _configuration["SMTP_HOST"] ?? "localhost";
        var smtpPort = int.Parse(_configuration["SMTP_PORT"] ?? "587");
        var smtpUser = _configuration["SMTP_USER"];
        var smtpPass = _configuration["SMTP_PASS"];

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(smtpUser ?? "noreply@eventosnorma.com"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(to);

        await client.SendMailAsync(mailMessage);
    }

    public async Task SendTemplatedEmailAsync(string to, string subject, string templateName, Dictionary<string, string> variables)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = $"EventosNorma.Infrastructure.Templates.Email.{templateName}.html";
        
        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
        {
            throw new FileNotFoundException($"Plantilla de email no encontrada: {resourceName}");
        }

        using var reader = new StreamReader(stream);
        var template = await reader.ReadToEndAsync();

        foreach (var variable in variables)
        {
            template = template.Replace($"{{{{{variable.Key}}}}}", variable.Value);
        }

        await SendEmailAsync(to, subject, template);
    }
}