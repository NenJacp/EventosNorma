using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using EventosNorma.Infrastructure.Repositories;
using EventosNorma.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Presentation.DependencyInjection;

public static class InfrastructureServicesExtensions
{
    public static WebApplicationBuilder AddInfrastructureServices(this WebApplicationBuilder builder)
    {
        var dbHost = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_HOST");
        var dbPort = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_PORT");
        var dbName = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_NAME");
        var dbUser = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_USER");
        var dbPass = Environment.GetEnvironmentVariable("EVENTOSNORMA_DB_PASSWORD");

        var connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPass}";
        builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

        builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
        builder.Services.AddScoped<IJwtProvider, JwtProvider>();
        builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddScoped<IFileService, FileService>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IUserTokenRepository, UserTokenRepository>();
        builder.Services.AddScoped<IEventRepository, EventRepository>();
        builder.Services.AddScoped<IEventCommentRepository, EventCommentRepository>();
        builder.Services.AddScoped<IEventMemberRepository, EventMemberRepository>();
        builder.Services.AddScoped<ICountryRepository, CountryRepository>();
        builder.Services.AddScoped<IStateRepository, StateRepository>();
        builder.Services.AddScoped<ICityRepository, CityRepository>();
        builder.Services.AddScoped<IEventCategoryRepository, EventCategoryRepository>();
        builder.Services.AddScoped<IEventTypeRepository, EventTypeRepository>();

        return builder;
    }
}
