using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventosNorma.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTokenToCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Token",
                table: "user_tokens",
                newName: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Code",
                table: "user_tokens",
                newName: "Token");
        }
    }
}
