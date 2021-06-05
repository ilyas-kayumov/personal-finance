using Microsoft.EntityFrameworkCore.Migrations;

namespace PersonalFinanceWebApi.Migrations
{
    public partial class Init7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId",
                unique: true);
        }
    }
}
