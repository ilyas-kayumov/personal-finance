using System.Text.Json.Serialization;

namespace PersonalFinanceWebApi.Model
{
    public class Property
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual Money Cost { get; set; }
        [JsonIgnore]
        public int BalanceId { get; set; }
        [JsonIgnore]
        public virtual Balance Balance { get; set; }

        public override string ToString()
        {
            return $"Name: {Name}, Cost: {{ {Cost} }}";
        }
    }
}
