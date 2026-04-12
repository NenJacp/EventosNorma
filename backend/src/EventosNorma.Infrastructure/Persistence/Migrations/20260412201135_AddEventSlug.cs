using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventosNorma.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddEventSlug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "events",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_events_Slug",
                table: "events",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_events_Slug",
                table: "events");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "events");
        }
    }
}
