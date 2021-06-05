using System.Collections.Generic;
using System.Linq;

namespace PersonalFinanceWebApi.Model
{
    public class Currency
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public decimal Rate { get; set; }

        public Currency(string code, decimal rate)
        {
            Code = code;
            Rate = rate;
        }
    }
}