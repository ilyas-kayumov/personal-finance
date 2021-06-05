using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using PersonalFinanceWebApi.Model;
using PersonalFinanceWebApi.Services;

namespace PersonalFinanceWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CurrenciesController : ControllerBase
    {
        private readonly ApplicationContext context;
        private readonly CurrencyExchangeService exchangeService;

        public CurrenciesController(ApplicationContext context, CurrencyExchangeService exchangeService)
        {
            this.context = context;
            this.exchangeService = exchangeService;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            var currencies = context.Currencies.Select(c => c.Code).ToArray();
            Array.Sort(currencies);
            return currencies;
        }

        [HttpGet]
        public IEnumerable<ExchangeRateResponse> GetAllRates(string currency)
        {
            return exchangeService.GetExchangeRates(context.Currencies.Select(c => c.Code), currency);
        }

        [HttpGet]
        public IEnumerable<ExchangeRateResponse> GetPopularRates()
        {
            return exchangeService.GetExchangeRates(new[] { "EUR", "JPY", "GBP", "AUD", "CAD" /*, "CNY", "CHF", "HKD"*/ }, "USD");
        }

        [HttpGet]
        public ExchangeRateResponse GetRate(string sourceCurrency, string targetCurrency)
        {
            return exchangeService.GetExchangeRates(new[] { sourceCurrency }, targetCurrency).First();
        }

        [HttpGet]
        public decimal Exchange(decimal sourceAmount, string sourceCurrency, string targetCurrency)
        {
            var money = new Money() { Amount = sourceAmount, Currency = sourceCurrency };
            return exchangeService.Exchange(money, targetCurrency);
        }
    }
}