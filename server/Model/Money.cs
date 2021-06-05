using System.Text.Json.Serialization;

namespace PersonalFinanceWebApi.Model
{
    public class Money
    {
        public int Id { get; set; }
        public string Currency { get; set; }
        public decimal Amount { get; set; }

        public override string ToString()
        {
            return $"Currency: {Currency}, Amount: {Amount}";
        }
    }
}
