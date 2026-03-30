using EventosNorma.Domain.Associations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventosNorma.Infrastructure.Persistence.Configurations;

public class EventMemberConfiguration : IEntityTypeConfiguration<EventMember>
{
    public void Configure(EntityTypeBuilder<EventMember> builder)
    {
        builder.ToTable("event_members");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.JoinedAt).IsRequired();

        // Relación con Evento
        builder.HasOne(e => e.Event)
            .WithMany(ev => ev.Members)
            .HasForeignKey(e => e.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relación con Usuario
        builder.HasOne(e => e.User)
            .WithMany(u => u.EventMemberships)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
