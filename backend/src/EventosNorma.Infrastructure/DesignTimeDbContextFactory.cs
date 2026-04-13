using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using EventosNorma.Infrastructure.Persistence;

namespace EventosNorma.Infrastructure
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            
            var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                ?? "Host=localhost;Database=eventosnorma;Username=postgres;Password=postgres";
            
            optionsBuilder.UseNpgsql(connectionString);
            
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
