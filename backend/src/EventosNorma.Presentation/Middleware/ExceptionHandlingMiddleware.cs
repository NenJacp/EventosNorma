using System.Net;
using System.Text.Json;
using EventosNorma.Application.Common.Models;
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
        var message = "Ocurrió un error inesperado en el servidor.";
        List<string> errors = new List<string>();

        if (exception is ValidationException validationException)
        {
            code = HttpStatusCode.BadRequest;
            message = "Error de validación";
            errors = validationException.Errors.Select(e => e.ErrorMessage).ToList();
        }
        else if (exception is EventosNorma.Domain.Exceptions.DomainException || exception is ArgumentException)
        {
            code = HttpStatusCode.BadRequest;
            message = exception.Message;
            errors.Add(exception.Message);
        }
        else if (exception is KeyNotFoundException)
        {
            code = HttpStatusCode.NotFound;
            message = exception.Message;
            errors.Add(exception.Message);
        }
        else if (exception is UnauthorizedAccessException)
        {
            code = HttpStatusCode.Unauthorized;
            message = exception.Message;
            errors.Add(exception.Message);
        }
        else if (_env.IsDevelopment())
        {
            message = exception.Message;
            errors.Add(exception.ToString());
        }

        var apiResponse = ApiResponse<object>.Fail(message, errors.Any() ? errors : null);

        var result = JsonSerializer.Serialize(apiResponse, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        await context.Response.WriteAsync(result);
    }
}
