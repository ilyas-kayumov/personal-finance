using System.Text.Json.Serialization;

namespace PersonalFinanceWebApi.Model
{
    public class MoneyAccount
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public virtual int MoneyId { get; set; }
        public virtual Money Money { get; set; }
        [JsonIgnore]
        public int BalanceId { get; set; }
        [JsonIgnore]
        public virtual Balance Balance { get; set; }
    }
}