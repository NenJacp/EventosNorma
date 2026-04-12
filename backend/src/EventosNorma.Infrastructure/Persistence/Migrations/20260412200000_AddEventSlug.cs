using System;
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
                nullable: true);

            // Generar slugs para eventos existentes
            migrationBuilder.Sql(@"
                UPDATE events 
                SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)
                WHERE slug IS NULL;
            ");

            // Hacer la columna NOT NULL después de generar los slugs
            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "events",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false);

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