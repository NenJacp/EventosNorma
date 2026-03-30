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

        // Relación con Ciudad
        builder.HasOne(e => e.City)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación con Creador (Usuario)
        builder.HasOne(e => e.Creator)
            .WithMany() 
            .HasForeignKey(e => e.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
