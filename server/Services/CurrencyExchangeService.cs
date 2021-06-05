using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using PersonalFinanceWebApi.Model;

namespace PersonalFinanceWebApi.Services
{
    public class CurrencyExchangeService
    {
        private readonly object ratesLock = new object();
        private Dictionary<string, decimal> ratesUSD = new Dictionary<string, decimal>();
        public readonly IEnumerable<string> Currencies = new [] { "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "RUB" };
        private readonly ILogger<CurrencyExchangeService> logger;
        private readonly ApplicationContext context;

        public CurrencyExchangeService(ILogger<CurrencyExchangeService> logger, ApplicationContext context)
        {
            this.logger = logger;
            this.context = context;
        }

        public IEnumerable<ExchangeRateResponse> GetExchangeRates(IEnumerable<string> currencies, string currency)
        {
            foreach (var c in currencies)
            {
                var rate = GetExchangeRate(c, currency);
                if (rate >= 1)
                {
                    yield return new ExchangeRateResponse()
                    {
                        Id = c + '-' + currency,
                        SourceCurrency = c,
                        TargetCurrency = currency,
                        Rate = rate
                    };
                }
                else
                {
                    rate = GetExchangeRate(currency, c);
                    yield return new ExchangeRateResponse()
                    {
                        Id = currency + '-' + c,
                        SourceCurrency = currency,
                        TargetCurrency = c,
                        Rate = rate
                    };
                }
            }
        }

        public decimal GetExchangeRate(string sourceCurrency, string targetCurrency)
        {
            if (ratesUSD.Count == 0)
            {
                logger.LogInformation("Update rates");
                ratesUSD = context.Currencies.ToDictionary(c => c.Code, c => c.Rate);
            }

            decimal rate;

            if (targetCurrency == sourceCurrency)
            {
                rate = 1;
            }
            else if (targetCurrency == "USD")
            {
                rate = 1 / ratesUSD[sourceCurrency];
            }
            else if (sourceCurrency == "USD")
            {
                rate = ratesUSD[targetCurrency];
            }
            else
            {
                return ratesUSD[targetCurrency] * GetExchangeRate(sourceCurrency, "USD");
            }

            return rate;
        }

        public decimal Exchange(Money money, string targetCurrency = "USD")
        {
            return money.Amount * GetExchangeRate(money.Currency, targetCurrency);
        }

        // private async Task UpdateRates(IEnumerable<string> currencies)
        // {
        //     var selectedCurrencies = currencies.Where(c => c != "USD");
        //     var response = await new HttpClient().GetAsync(GetURI(selectedCurrencies));

        //     logger.LogInformation(GetURI(selectedCurrencies));

        //     var responseContent = await response.Content.ReadAsStringAsync();

        //     lock (ratesLock)
        //     {
        //         if (ratesUSD.Count > 0)
        //         {
        //             return;
        //         }

        //         var json = JObject.Parse(responseContent);

        //         logger.LogInformation(responseContent);

        //         foreach (var c in selectedCurrencies)
        //         {
        //             var result = (decimal)json["rates"]["USD" + c]["rate"];
        //             ratesUSD.Add(c, result); 
        //         }
        //     }
        // }

        // private string GetURI(IEnumerable<string> currencies)
        // {
        //     var pairs = string.Join(',', currencies.Select(c => "USD" + c));
        //     return "https://www.freeforexapi.com/api/live?pairs=" + pairs;
        // }

        private async Task UpdateRates(IEnumerable<string> currencies)
        {
            var selectedCurrencies = currencies.Where(c => c != "USD");

            // For Release
            //var response = await new HttpClient().GetAsync("https://api.exchangeratesapi.io/latest?base=USD");

            //var responseContent = await response.Content.ReadAsStringAsync();

            // For Debug
            var responseContent = "{\"rates\":{\"CAD\":1.3762169047,\"HKD\":7.7521608589,\"ISK\":137.5671003548,\"PHP\":50.648712583,\"DKK\":6.7858247657,\"HUF\":317.2595760167,\"CZK\":24.6119552361,\"GBP\":0.8151669548,\"RON\":4.4066054044,\"SEK\":9.6085888454,\"IDR\":14709.9990901647,\"INR\":75.7392411973,\"BRL\":5.3388226731,\"RUB\":71.066872896,\"HRK\":6.9050131926,\"JPY\":107.8882722227,\"THB\":31.8951869712,\"CHF\":0.9712492039,\"EUR\":0.9098353198,\"MYR\":4.3474661086,\"BGN\":1.7794559185,\"TRY\":6.7820944409,\"CNY\":7.1587662633,\"NOK\":9.8519697935,\"NZD\":1.6121372032,\"ZAR\":17.4212537531,\"USD\":1.0,\"MXN\":22.3269948139,\"SGD\":1.4182512965,\"AUD\":1.5071422073,\"ILS\":3.5038668001,\"KRW\":1236.5025930307,\"PLN\":4.037121281},\"base\":\"USD\",\"date\":\"2020-05-27\"}";

            lock (ratesLock)
            {
                if (ratesUSD.Count > 0)
                {
                    return;
                }

                var json = JObject.Parse(responseContent);

                logger.LogInformation(responseContent);

                foreach (var c in selectedCurrencies)
                {
                    var result = (decimal)json["rates"][c];
                    ratesUSD.Add(c, result); 
                }
            }
        }
    }
}
