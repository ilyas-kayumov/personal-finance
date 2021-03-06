// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using PersonalFinanceWebApi.Model;

namespace PersonalFinanceWebApi.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20200619103846_Init8")]
    partial class Init8
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Balance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Balance");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Currency", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Code")
                        .HasColumnType("text");

                    b.Property<decimal>("Rate")
                        .HasColumnType("numeric");

                    b.HasKey("Id");

                    b.ToTable("Currencies");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.EmailVerification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<bool>("IsVerified")
                        .HasColumnType("boolean");

                    b.Property<string>("VerificationCode")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("EmailVerifications");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Money", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric");

                    b.Property<string>("Currency")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Money");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.MoneyAccount", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("BalanceId")
                        .HasColumnType("integer");

                    b.Property<int>("MoneyId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("BalanceId");

                    b.HasIndex("MoneyId");

                    b.ToTable("MoneyAccount");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Property", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("BalanceId")
                        .HasColumnType("integer");

                    b.Property<int?>("CostId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("BalanceId");

                    b.HasIndex("CostId");

                    b.ToTable("Property");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Login")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Balance", b =>
                {
                    b.HasOne("PersonalFinanceWebApi.Model.User", "User")
                        .WithOne("Balance")
                        .HasForeignKey("PersonalFinanceWebApi.Model.Balance", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.MoneyAccount", b =>
                {
                    b.HasOne("PersonalFinanceWebApi.Model.Balance", "Balance")
                        .WithMany("MoneyAccounts")
                        .HasForeignKey("BalanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PersonalFinanceWebApi.Model.Money", "Money")
                        .WithMany()
                        .HasForeignKey("MoneyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("PersonalFinanceWebApi.Model.Property", b =>
                {
                    b.HasOne("PersonalFinanceWebApi.Model.Balance", "Balance")
                        .WithMany("Properties")
                        .HasForeignKey("BalanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PersonalFinanceWebApi.Model.Money", "Cost")
                        .WithMany()
                        .HasForeignKey("CostId");
                });
#pragma warning restore 612, 618
        }
    }
}
