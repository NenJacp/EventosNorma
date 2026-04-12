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
            // Agregar columna nullable temporalmente
            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "events",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                defaultValue: null);

            // Generar slugs simples
            migrationBuilder.Sql(@"
                UPDATE events 
                SET slug = LOWER(REPLACE(title, ' ', '-')) || '-' || id::TEXT
                WHERE slug IS NULL OR slug = '';
            ");

            // Actualizar valores nulos con默认值
            migrationBuilder.Sql(@"
                UPDATE events 
                SET slug = 'evento-' || id::TEXT
                WHERE slug IS NULL OR slug = '';
            ");

            // Hacer la columna NOT NULL
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