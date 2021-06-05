using System.Collections.Generic;
using PersonalFinanceWebApi.Model;

namespace PersonalFinanceWebApi.Controllers
{
    public class BalanceResponse
    {
        public IEnumerable<MoneyAccount> MoneyAccounts { get; set; }
        public IEnumerable<Property> Properties { get; set; }
        public Money Total { get; set; }
        public IEnumerable<ExchangeRateResponse> ExchangeRates { get; set; }
    }
}
