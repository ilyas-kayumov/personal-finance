using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PersonalFinanceWebApi.Model;
using PersonalFinanceWebApi.Services;

namespace PersonalFinanceWebApi.Controllers
{
    //ilyas@ilyas-HP-Notebook:~$ curl -k -i --header "Content-Type: application/json"   --request POST   --data '{"currency":"USD","amount":200}'  https://localhost:5001/balance/addmoney
    [ApiController]
    [Authorize]
    [Route("api/[controller]/[action]")]
    public class BalanceController : ControllerBase
    {
        private readonly ILogger<BalanceController> logger;
        private readonly ApplicationContext context;
        private readonly CurrencyExchangeService currencyExchangeService;

        public BalanceController(ILogger<BalanceController> logger, ApplicationContext context, CurrencyExchangeService currencyExchangeService)
        {
            this.logger = logger;
            this.context = context;
            this.currencyExchangeService = currencyExchangeService;
        }

        [HttpGet]
        public async Task<IEnumerable<ExchangeRateResponse>> GetExchangeRates(string targetCurrency)
        {
            var person = await context.GetPersonByPrincipalAsync(User);
            logger.LogInformation("person " + person);
            var balance = person.Balance;
            logger.LogInformation("balance " + balance);
            return GetExchangeRates(balance, targetCurrency);
        }

        [HttpGet]
        public async Task<BalanceResponse> Get()
        {
            var person = await context.GetPersonByPrincipalAsync(User);
            logger.LogInformation("person " + person);
            var balance = person.Balance;
            logger.LogInformation("balance " + balance);
            var total = new Money { Currency = "USD", Amount = await TotalAsync("USD") };
            return new BalanceResponse()
            {
                MoneyAccounts = balance.MoneyAccounts,
                Properties = balance.Properties,
                Total = total,
                ExchangeRates = GetExchangeRates(balance, total.Currency)
            };
        }

        private IEnumerable<ExchangeRateResponse> GetExchangeRates(Balance balance, string totalCurrency)
        {
            var sourceCurrencies = balance.MoneyAccounts.Select(a => a.Money.Currency).Distinct().Where(c => c != totalCurrency);

            return currencyExchangeService.GetExchangeRates(sourceCurrencies, totalCurrency);
        }

        [HttpGet]
        public async Task<decimal> TotalAsync(string currency)
        {
            var person = await context.GetPersonByPrincipalAsync(User);

            var balance = person.Balance;

            var total = 0m;

            logger.LogInformation($"C: {currency}");
            foreach (var money in balance.MoneyAccounts.Select(a => a.Money).Union(balance.Properties.Select(p => p.Cost)))
            {
                logger.LogInformation($"Money: {money}");
                total += currencyExchangeService.Exchange(money, currency);
            }

            logger.LogInformation($"Total: {total}");

            return total;
        }
    }
}
