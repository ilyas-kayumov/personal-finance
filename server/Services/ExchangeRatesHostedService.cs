using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PersonalFinanceWebApi.Model;

public class ExchangeRatesHostedService : IHostedService
{
    private readonly IServiceScopeFactory scopeFactory;
    private readonly Timer timer;

    public ExchangeRatesHostedService(IServiceScopeFactory scopeFactory)
    {
        this.scopeFactory = scopeFactory;

        var period = (int) TimeSpan.FromHours(12).TotalMilliseconds;
        timer = new Timer(DoWork, null, period, period);
    }

    private async void DoWork(object state)
    {
        using (var scope = scopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            await UpdateRatesAsync(context, configuration);
        }
    }

    public async Task UpdateRatesAsync(ApplicationContext context, IConfiguration configuration)
    {
        foreach (var rate in await CurrenciesRatesProviderService.GetRates(configuration["RatesProviderURL"]))
        {
            var currency = context.Currencies.First(r => r.Code == rate.Key);
            currency.Rate = decimal.Parse((string)rate.Value);
            context.Update(currency);
        }

        await context.SaveChangesAsync();
    }


    public Task StartAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}