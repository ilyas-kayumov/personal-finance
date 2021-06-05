using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace PersonalFinanceWebApi.Model
{
    public class Balance
    {
        public int Id { get; set; }
        public virtual ICollection<MoneyAccount> MoneyAccounts { get; set; }
        public virtual ICollection<Property> Properties { get; set; }
        [JsonIgnore]
        public virtual int UserId { get; set; }
        [JsonIgnore]
        public virtual User User { get; set; }
        public MoneyAccount FindMoneyAccount(int id)
        {
            return MoneyAccounts.First(m => m.Id == id);
        }

        public Property FindProperty(int id)
        {
            return Properties.First(p => p.Id == id);
        }
    }
}
