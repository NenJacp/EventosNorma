using EventosNorma.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventosNorma.Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("events");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Description).HasMaxLength(2000);
        builder.Property(e => e.LocationDetail).HasMaxLength(500);
        
        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(e => e.ImageUrl).HasMaxLength(500);
        builder.Property(e => e.RequiresApproval).HasDefaultValue(false);

        // Relación con Ciudad
        builder.HasOne(e => e.City)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación con Categoría
        builder.HasOne(e => e.EventCategory)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.EventCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación con Tipo
        builder.HasOne(e => e.EventType)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.EventTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación con Creador (Usuario)
        builder.HasOne(e => e.Creator)
            .WithMany() 
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
