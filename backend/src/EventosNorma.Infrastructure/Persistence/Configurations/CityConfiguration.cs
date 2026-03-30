using EventosNorma.Domain.Catalogs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventosNorma.Infrastructure.Persistence.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.ToTable("cities");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Name).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Code).IsRequired().HasMaxLength(10);
        builder.Property(e => e.CreatedAt).IsRequired();

        builder.HasOne(e => e.State)
            .WithMany(s => s.Cities)
            .HasForeignKey(e => e.StateId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
