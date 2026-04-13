using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventosNorma.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMemberBannedFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "event_members",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "BannedAt",
                table: "event_members",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannedAt",
                table: "event_members");

            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "event_members");
        }
    }
}
