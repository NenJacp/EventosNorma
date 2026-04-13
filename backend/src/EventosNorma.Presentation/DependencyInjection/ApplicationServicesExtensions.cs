using System.Text.Json.Serialization;
using EventosNorma.Application.Features.Entities.Users.Commands;
using FluentValidation;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;

namespace EventosNorma.Presentation.DependencyInjection;

public static class ApplicationServicesExtensions
{
    public static WebApplicationBuilder AddApplicationServices(this WebApplicationBuilder builder)
    {
        builder.Host.UseWolverine(options =>
        {
            options.Discovery.IncludeAssembly(typeof(RegisterUserHandler).Assembly);
            options.UseFluentValidation();
            options.UseEntityFrameworkCoreTransactions();
        });

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserHandler>();
        builder.Services.AddHttpContextAccessor();

        return builder;
    }
}
