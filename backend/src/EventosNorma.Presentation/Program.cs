using EventosNorma.Application.Interfaces;
using EventosNorma.Application.Services;
using EventosNorma.Domain.Interfaces;
using EventosNorma.Infrastructure.Persistence;
using EventosNorma.Infrastructure.Repositories;
using EventosNorma.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (File.Exists(".env")) DotNetEnv.Env.Load(".env");
else if (File.Exists("../.env")) DotNetEnv.Env.Load("../.env");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
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
        catch (Exception ex)
        {
            retries--;
            if (retries == 0) throw;
            Thread.Sleep(3000);
        }
    }
}

app.Run();
