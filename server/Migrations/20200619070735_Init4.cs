using Microsoft.EntityFrameworkCore.Migrations;

namespace PersonalFinanceWebApi.Migrations
{
    public partial class Init4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Balance_BalanceId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_BalanceId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BalanceId",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Balance",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Balance_UserId",
                table: "Balance",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Balance_Users_UserId",
                table: "Balance",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Balance_Users_UserId",
                table: "Balance");

            migrationBuilder.DropIndex(
                name: "IX_Balance_UserId",
                table: "Balance");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Balance");

            migrationBuilder.AddColumn<int>(
                name: "BalanceId",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Users_BalanceId",
                table: "Users",
                column: "BalanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Balance_BalanceId",
                table: "Users",
                column: "BalanceId",
                principalTable: "Balance",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
