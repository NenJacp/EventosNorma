using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace EventosNorma.Presentation.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Uncaught exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var title = "Server Error";
        var detail = _env.IsDevelopment() ? exception.Message : "Ocurrió un error inesperado en el servidor.";
        var type = "https://tools.ietf.org/html/rfc7231#section-6.6.1";
        IDictionary<string, string[]>? validationErrors = null;

        if (exception is ValidationException validationException)
        {
            code = HttpStatusCode.BadRequest;
            title = "Validation Error";
            detail = "Uno o más errores de validación han ocurrido.";
            type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
            validationErrors = validationException.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );
        }
        else if (exception is EventosNorma.Domain.Exceptions.DomainException || exception is ArgumentException)
        {
            code = HttpStatusCode.BadRequest;
            title = exception is ArgumentException ? "Argument Error" : "Domain Error";
            detail = exception.Message;
            type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
        }
        else if (exception is KeyNotFoundException)
        {
            code = HttpStatusCode.NotFound;
            title = "Not Found";
            detail = exception.Message;
            type = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
        }
        else if (exception is UnauthorizedAccessException)
        {
            code = HttpStatusCode.Unauthorized;
            title = "Unauthorized";
            detail = exception.Message;
            type = "https://tools.ietf.org/html/rfc7235#section-3.1";
        }

        var problemDetails = new ProblemDetails
        {
            Status = (int)code,
            Title = title,
            Detail = detail,
            Type = type,
            Instance = context.Request.Path
        };

        if (validationErrors != null)
        {
            problemDetails.Extensions["errors"] = validationErrors;
        }

        var result = JsonSerializer.Serialize(problemDetails);
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)code;

        await context.Response.WriteAsync(result);
    }
}
