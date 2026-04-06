using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventosNorma.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntitiesAndResponses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReplacedByToken",
                table: "user_tokens",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RevokedAt",
                table: "user_tokens",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "event_comments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentCommentId",
                table: "event_comments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_event_comments_ParentCommentId",
                table: "event_comments",
                column: "ParentCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_event_comments_event_comments_ParentCommentId",
                table: "event_comments",
                column: "ParentCommentId",
                principalTable: "event_comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_event_comments_event_comments_ParentCommentId",
                table: "event_comments");

            migrationBuilder.DropIndex(
                name: "IX_event_comments_ParentCommentId",
                table: "event_comments");

            migrationBuilder.DropColumn(
                name: "ReplacedByToken",
                table: "user_tokens");

            migrationBuilder.DropColumn(
                name: "RevokedAt",
                table: "user_tokens");

            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "event_comments");

            migrationBuilder.DropColumn(
                name: "ParentCommentId",
                table: "event_comments");
        }
    }
}
