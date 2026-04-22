using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CommunityCenter.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinalChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Categories_CategoryId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Employees_EmployeeId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Events_EventId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Subscribers_SubscriberId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Employees_EmployeeId",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_CourseRegistrations_CourseId",
                table: "CourseRegistrations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_EventRegistrations_EventId",
                table: "EventRegistrations");

            migrationBuilder.RenameTable(
                name: "EventRegistrations",
                newName: "RegistrationEvents");

            migrationBuilder.RenameColumn(
                name: "Time",
                table: "Courses",
                newName: "StartTime");

            migrationBuilder.RenameIndex(
                name: "IX_EventRegistrations_SubscriberId",
                table: "RegistrationEvents",
                newName: "IX_RegistrationEvents_SubscriberId");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Subscribers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "IdentityCard",
                table: "Subscribers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Subscribers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "News",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "News",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                table: "Events",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Events",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "CurrentRegistrations",
                table: "Events",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Courses",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<int>(
                name: "DayOfWeek",
                table: "Courses",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "Courses",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Courses",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "ContactRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "ContactRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RegistrationEvents",
                table: "RegistrationEvents",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_Email",
                table: "Subscribers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscribers_IdentityCard",
                table: "Subscribers",
                column: "IdentityCard",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_News_EmployeeId",
                table: "News",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseRegistrations_CourseId_SubscriberId",
                table: "CourseRegistrations",
                columns: new[] { "CourseId", "SubscriberId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RegistrationEvents_EventId_SubscriberId",
                table: "RegistrationEvents",
                columns: new[] { "EventId", "SubscriberId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Categories_CategoryId",
                table: "Courses",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Employees_EmployeeId",
                table: "Courses",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Employees_EmployeeId",
                table: "Events",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_News_Employees_EmployeeId",
                table: "News",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationEvents_Events_EventId",
                table: "RegistrationEvents",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationEvents_Subscribers_SubscriberId",
                table: "RegistrationEvents",
                column: "SubscriberId",
                principalTable: "Subscribers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Categories_CategoryId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Employees_EmployeeId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Events_Employees_EmployeeId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_News_Employees_EmployeeId",
                table: "News");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationEvents_Events_EventId",
                table: "RegistrationEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationEvents_Subscribers_SubscriberId",
                table: "RegistrationEvents");

            migrationBuilder.DropIndex(
                name: "IX_Subscribers_Email",
                table: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_Subscribers_IdentityCard",
                table: "Subscribers");

            migrationBuilder.DropIndex(
                name: "IX_News_EmployeeId",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_CourseRegistrations_CourseId_SubscriberId",
                table: "CourseRegistrations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RegistrationEvents",
                table: "RegistrationEvents");

            migrationBuilder.DropIndex(
                name: "IX_RegistrationEvents_EventId_SubscriberId",
                table: "RegistrationEvents");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "News");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "News");

            migrationBuilder.DropColumn(
                name: "CurrentRegistrations",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "ContactRequests");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "ContactRequests");

            migrationBuilder.RenameTable(
                name: "RegistrationEvents",
                newName: "EventRegistrations");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Courses",
                newName: "Time");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationEvents_SubscriberId",
                table: "EventRegistrations",
                newName: "IX_EventRegistrations_SubscriberId");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "IdentityCard",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Subscribers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                table: "Events",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)",
                oldPrecision: 10,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "ImagePath",
                table: "Events",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Courses",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)",
                oldPrecision: 10,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "DayOfWeek",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_CourseRegistrations_CourseId",
                table: "CourseRegistrations",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrations_EventId",
                table: "EventRegistrations",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Categories_CategoryId",
                table: "Courses",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Employees_EmployeeId",
                table: "Courses",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Events_EventId",
                table: "EventRegistrations",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Subscribers_SubscriberId",
                table: "EventRegistrations",
                column: "SubscriberId",
                principalTable: "Subscribers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Employees_EmployeeId",
                table: "Events",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }
    }
}
