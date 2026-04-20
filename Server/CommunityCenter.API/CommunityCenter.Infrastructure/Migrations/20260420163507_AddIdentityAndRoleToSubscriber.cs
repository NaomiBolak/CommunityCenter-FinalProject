using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCenter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityAndRoleToSubscriber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Subscribers");
        }
    }
}
