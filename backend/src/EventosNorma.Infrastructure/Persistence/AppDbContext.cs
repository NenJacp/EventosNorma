using EventosNorma.Domain.Associations;
using EventosNorma.Domain.Catalogs;
using EventosNorma.Domain.Entities;
using EventosNorma.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventosNorma.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Entidades Principales
    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();

    // Catálogos Geográficos
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<State> States => Set<State>();
    public DbSet<City> Cities => Set<City>();

    // Catálogos de Eventos
    public DbSet<EventCategory> EventCategories => Set<EventCategory>();
    public DbSet<EventType> EventTypes => Set<EventType>();

    // Asociaciones
    public DbSet<EventMember> EventMembers => Set<EventMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries();

        foreach (var entry in entries)
        {
            if (entry.Entity is IAuditableEntity auditable)
            {
                if (entry.State == EntityState.Added)
                {
                    if (auditable.CreatedAt == default)
                    {
                        entry.Property(nameof(IAuditableEntity.CreatedAt)).CurrentValue = DateTime.UtcNow;
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Property(nameof(IAuditableEntity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
