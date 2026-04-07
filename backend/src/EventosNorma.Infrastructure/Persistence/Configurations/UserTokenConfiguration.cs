using EventosNorma.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventosNorma.Infrastructure.Persistence.Configurations;

public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
{
    public void Configure(EntityTypeBuilder<UserToken> builder)
    {
        builder.ToTable("user_tokens");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Code).IsRequired().HasMaxLength(500);
        builder.Property(e => e.Type).IsRequired().HasConversion<int>();
        builder.Property(e => e.ExpiresAt).IsRequired();
        builder.Property(e => e.IsUsed).HasDefaultValue(false);
        builder.Property(e => e.RevokedAt);
        builder.Property(e => e.ReplacedByToken).HasMaxLength(500);

        builder.HasOne(e => e.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
