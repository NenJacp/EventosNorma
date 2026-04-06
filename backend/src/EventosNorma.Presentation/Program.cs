using EventosNorma.Infrastructure.Persistence;
using EventosNorma.Presentation.DependencyInjection;
using EventosNorma.Presentation.Middleware;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar FluentValidation global para español
ValidatorOptions.Global.LanguageManager.Culture = new System.Globalization.CultureInfo("es");

if (File.Exists(".env")) DotNetEnv.Env.Load(".env");
else if (File.Exists("../.env")) DotNetEnv.Env.Load("../.env");

// Resincronizar la configuración para incluir las variables cargadas desde .env
builder.Configuration.AddEnvironmentVariables();

// Forzar puerto 8080 para compatibilidad con .NET 8+ y Docker (usuario no root)
builder.WebHost.UseUrls("http://*:8080");

builder
    .AddApplicationServices()
    .AddAuthSwaggerServices()
    .AddInfrastructureServices();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Remover restricción de entorno para asegurar que Swagger cargue en cualquier ambiente
// durante la etapa de pruebas/despliegue
app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();

    int retries = 10;
    while (retries > 0)
    {
        try
        {
            db.Database.Migrate();
            break;
        }
        catch (Exception)
        {
            retries--;
            if (retries == 0) throw;
            Thread.Sleep(3000);
        }
    }
}

app.Run();
