using System.Text;
using EventosNorma.Application.Features.Users.Commands;
using EventosNorma.Infrastructure.Features.Users.Commands;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using EventosNorma.Infrastructure.Security;
using EventosNorma.Presentation.Middleware;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Configurar FluentValidation global para español
ValidatorOptions.Global.LanguageManager.Culture = new System.Globalization.CultureInfo("es");

if (File.Exists(".env")) DotNetEnv.Env.Load(".env");
else if (File.Exists("../.env")) DotNetEnv.Env.Load("../.env");

// Resincronizar la configuración para incluir las variables cargadas desde .env
builder.Configuration.AddEnvironmentVariables();

// configuración de Wolverine
builder.Host.UseWolverine(options =>
{
    // Escaneamos el proyecto de Infrastructure para encontrar los Handlers
    options.Discovery.IncludeAssembly(typeof(RegisterUserHandler).Assembly);

    // Activa la validación automática de FluentValidation
    options.UseFluentValidation();

    // Configura Wolverine para usar transacciones de EF Core automáticamente
    options.UseEntityFrameworkCoreTransactions();
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EventosNorma API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserValidator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?.Split(',') 
                             ?? new[] { "http://localhost:3000" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var dbHost = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_HOST");
var dbPort = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_PORT");
var dbName = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_USER");
var dbPass = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_PASSWORD");

var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Authentication Configuration
var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "super_secret_key_default_32_characters_long";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "EventosNorma",
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "EventosNormaClient",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Prioridad 1: Cabecera Authorization
                var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                {
                    context.Token = authHeader.Substring("Bearer ".Length).Trim();
                }
                // Prioridad 2: Cookie 'jwt'
                else if (context.Request.Cookies.ContainsKey("jwt"))
                {
                    context.Token = context.Request.Cookies["jwt"];
                }
                
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
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
