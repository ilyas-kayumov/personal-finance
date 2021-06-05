using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PersonalFinanceWebApi.Model;
using PersonalFinanceWebApi.Services;

namespace PersonalFinanceWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var provider = scope.ServiceProvider;
                try
                {
                    var context = provider.GetRequiredService<ApplicationContext>();
                    var cryptoService = provider.GetRequiredService<CryptoService>();
                    var ratesProviderService = provider.GetRequiredService<CurrenciesRatesProviderService>();
                    var configuration = provider.GetRequiredService<IConfiguration>();
                    ContextInitializer.SeedAsync(context, cryptoService, ratesProviderService, configuration).Wait();
                }
                catch (Exception e)
                {
                    var logger = provider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(e, "An error occurred while seeding the database.");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureServices(services =>
                {
                    services.AddHostedService<ExchangeRatesHostedService>();
                    services.AddHostedService<AnonymousUsersHostedService>();
                });
    }
}