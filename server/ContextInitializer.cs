using PersonalFinanceWebApi.Model;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace PersonalFinanceWebApi
{
    public class ContextInitializer
    {
        public async static Task SeedAsync(ApplicationContext context, Services.CryptoService cryptoService,
            CurrenciesRatesProviderService ratesProviderService, IConfiguration configuration)
        {
            if (!context.Users.Any())
            {
                await context.AddUserAsync("q1", cryptoService.ComputeHash("1"));
                await context.AddUserAsync("q2", cryptoService.ComputeHash("2"));
                await context.SaveChangesAsync();
            }

            if (!context.Currencies.Any())
            {
                await AddRatesAsync(context, ratesProviderService, configuration);
                await context.SaveChangesAsync();
            }
        }

        private static async Task AddRatesAsync(ApplicationContext context, CurrenciesRatesProviderService ratesProviderService,
            IConfiguration configuration)
        {
            var rates = await CurrenciesRatesProviderService.GetRates(configuration["RatesProviderURL"]);

            foreach (var rate in rates)
            {
                await context.AddCurrencyAsync(rate.Key, decimal.Parse((string)rate.Value));
            }
        }
    }
}
