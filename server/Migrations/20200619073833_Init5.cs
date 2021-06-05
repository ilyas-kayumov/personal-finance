using Microsoft.EntityFrameworkCore.Migrations;

namespace PersonalFinanceWebApi.Migrations
{
    public partial class Init5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyAccount_Money_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.DropIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.AlterColumn<int>(
                name: "MoneyId",
                table: "MoneyAccount",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyAccount_Money_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId",
                principalTable: "Money",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyAccount_Money_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.DropIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount");

            migrationBuilder.AlterColumn<int>(
                name: "MoneyId",
                table: "MoneyAccount",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "IX_MoneyAccount_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId");

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyAccount_Money_MoneyId",
                table: "MoneyAccount",
                column: "MoneyId",
                principalTable: "Money",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
