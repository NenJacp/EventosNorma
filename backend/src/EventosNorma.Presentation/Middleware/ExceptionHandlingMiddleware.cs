using System.Net;
using System.Text.Json;
using FluentValidation;

namespace EventosNorma.Presentation.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
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

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError; // 500
        object errors = null;

        if (exception is ValidationException validationException)
        {
            code = HttpStatusCode.BadRequest; // 400
            errors = validationException.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );
        }
        else if (exception is EventosNorma.Domain.Exceptions.DomainException)
        {
            code = HttpStatusCode.BadRequest; // 400
            errors = new { error = exception.Message };
        }
        else if (exception is KeyNotFoundException)
        {
            code = HttpStatusCode.NotFound; // 404
            errors = new { error = exception.Message };
        }
        else
        {
            code = HttpStatusCode.InternalServerError; // 500
            errors = new { error = "Ocurrió un error inesperado en el servidor." };
        }

        var result = JsonSerializer.Serialize(errors);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}
