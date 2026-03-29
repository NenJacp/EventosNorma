using EventosNorma.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    // Sobrescribimos SaveChangesAsync para automatizar las fechas de auditoría
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries();

        foreach (var entry in entries)
        {
            if (entry.Entity is User user)
            {
                if (entry.State == EntityState.Added)
                {
                    // Solo asignamos si no se ha asignado antes (aunque ya lo hace el Factory Method, esto es seguridad extra)
                    var createdAtProperty = entry.Property(nameof(User.CreatedAt));
                    if ((DateTime)createdAtProperty.CurrentValue == default)
                    {
                        createdAtProperty.CurrentValue = DateTime.UtcNow;
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(nameof(User.UpdatedAt)).CurrentValue = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
